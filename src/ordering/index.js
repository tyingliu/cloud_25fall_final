// /src/ordering/index.js

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, QueryCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.DYNAMODB_TABLE_NAME;
const primaryKey = process.env.PRIMARY_KEY || 'userName';
const sortKey = process.env.SORT_KEY || 'orderDate';

exports.handler = async function (event) {
  console.log("Request:", JSON.stringify(event, undefined, 2));

  try {
    // Check if this is an SQS event (from EventBridge via SQS)
    if (event.Records) {
      return await handleSQSEvent(event);
    }

    // Handle API Gateway events
    if (event.httpMethod) {
      return await handleApiGatewayEvent(event);
    }

    throw new Error("Unsupported event type");

  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to process request",
        error: error.message
      })
    };
  }
};

// Handle SQS messages from EventBridge
async function handleSQSEvent(event) {
  console.log(`Processing ${event.Records.length} SQS messages`);

  const failedMessageIds = [];

  for (const record of event.Records) {
    try {
      console.log("SQS Record:", JSON.stringify(record, undefined, 2));

      // Parse the EventBridge event from SQS message body
      const eventBridgeEvent = JSON.parse(record.body);
      console.log("EventBridge Event:", JSON.stringify(eventBridgeEvent, undefined, 2));

      // Extract checkout basket data from EventBridge detail
      const checkoutRequest = eventBridgeEvent.detail;

      if (!checkoutRequest || !checkoutRequest.userName) {
        throw new Error("Invalid checkout request: missing userName");
      }

      // Create order from checkout basket
      const orderDate = new Date().toISOString();
      const order = {
        [primaryKey]: checkoutRequest.userName,
        [sortKey]: orderDate,
        totalPrice: checkoutRequest.totalPrice || 0,
        firstName: checkoutRequest.firstName || '',
        lastName: checkoutRequest.lastName || '',
        email: checkoutRequest.email || '',
        address: checkoutRequest.address || '',
        paymentMethod: checkoutRequest.paymentMethod || '',
        cardInfo: checkoutRequest.cardInfo || '',
        items: checkoutRequest.items || []
      };

      // Save order to DynamoDB
      const params = {
        TableName: tableName,
        Item: order
      };

      await ddbDocClient.send(new PutCommand(params));
      console.log(`Order created successfully for user: ${checkoutRequest.userName}`);

    } catch (error) {
      console.error(`Failed to process message ${record.messageId}:`, error);
      failedMessageIds.push(record.messageId);
    }
  }

  // Return batch item failures for retry
  if (failedMessageIds.length > 0) {
    return {
      batchItemFailures: failedMessageIds.map(id => ({ itemIdentifier: id }))
    };
  }

  return {
    batchItemFailures: []
  };
}

// Handle API Gateway requests
async function handleApiGatewayEvent(event) {
  let body;

  switch (event.httpMethod) {
    case "GET":
      if (event.pathParameters && event.pathParameters.userName) {
        // GET /order/{userName} - Get orders for specific user
        body = await getOrder(event.pathParameters.userName);
      } else {
        // GET /order - Get all orders
        body = await getAllOrders();
      }
      break;
    default:
      throw new Error(`Unsupported method: ${event.httpMethod}`);
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS"
    },
    body: JSON.stringify(body)
  };
}

// Get orders for a specific user
async function getOrder(userName) {
  console.log(`Getting orders for user: ${userName}`);

  try {
    const params = {
      TableName: tableName,
      KeyConditionExpression: `${primaryKey} = :userName`,
      ExpressionAttributeValues: {
        ':userName': userName
      },
      ScanIndexForward: false // Sort by orderDate descending (newest first)
    };

    const { Items } = await ddbDocClient.send(new QueryCommand(params));
    console.log(`Found ${Items.length} orders for user: ${userName}`);

    return Items;
  } catch (error) {
    console.error(`Error getting orders for user ${userName}:`, error);
    throw error;
  }
}

// Get all orders
async function getAllOrders() {
  console.log("Getting all orders");

  try {
    const params = {
      TableName: tableName
    };

    const { Items } = await ddbDocClient.send(new ScanCommand(params));
    console.log(`Found ${Items.length} total orders`);

    return Items;
  } catch (error) {
    console.error("Error getting all orders:", error);
    throw error;
  }
}