// /src/inventory/index.js

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.DYNAMODB_TABLE_NAME; // Product table
const primaryKey = process.env.PRIMARY_KEY || 'id';

exports.handler = async function (event) {
    console.log("Request:", JSON.stringify(event, undefined, 2));

    try {
        // Handle SQS messages from EventBridge (order events)
        if (event.Records) {
            return await handleSQSEvent(event);
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

// Handle SQS messages from EventBridge (order events)
async function handleSQSEvent(event) {
    console.log(`Processing ${event.Records.length} SQS messages for inventory update`);

    const failedMessageIds = [];

    for (const record of event.Records) {
        try {
            console.log("SQS Record:", JSON.stringify(record, undefined, 2));

            // Parse the EventBridge event from SQS message body
            const eventBridgeEvent = JSON.parse(record.body);
            console.log("EventBridge Event:", JSON.stringify(eventBridgeEvent, undefined, 2));

            // Extract order data from EventBridge detail
            const orderData = eventBridgeEvent.detail;

            if (!orderData || !orderData.items || !Array.isArray(orderData.items)) {
                throw new Error("Invalid order data: missing items");
            }

            // Update inventory for each item in the order
            for (const item of orderData.items) {
                if (!item.productId || !item.quantity) {
                    console.warn("Skipping invalid item:", item);
                    continue;
                }

                await decreaseStock(item.productId, item.quantity);
                console.log(`✅ Stock decreased for product ${item.productId}: -${item.quantity}`);
            }

        } catch (error) {
            console.error(`❌ Failed to process message ${record.messageId}:`, error);
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

// Decrease stock for a product
async function decreaseStock(productId, quantity) {
    console.log(`Decreasing stock for product ${productId} by ${quantity}`);

    try {
        const params = {
            TableName: tableName,
            Key: {
                [primaryKey]: productId
            },
            UpdateExpression: 'SET availableStock = availableStock - :quantity, lastRestocked = :lastRestocked',
            ConditionExpression: 'availableStock >= :quantity',  // ← Fixed: removed :zero reference
            ExpressionAttributeValues: {
                ':quantity': quantity,
                ':lastRestocked': new Date().toISOString()
                // ← Removed: ':zero': 0  (this was causing the error)
            },
            ReturnValues: 'ALL_NEW'
        };

        const { Attributes } = await ddbDocClient.send(new UpdateCommand(params));
        console.log(`✅ Stock updated for product ${productId}. New stock: ${Attributes.availableStock}`);

        // Check if reorder is needed
        if (Attributes.availableStock <= (Attributes.reorderLevel || 10)) {
            console.warn(`⚠️ LOW STOCK ALERT for product ${productId}: ${Attributes.availableStock} units remaining (reorder level: ${Attributes.reorderLevel || 10})`);
        }

        return Attributes;
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
            console.error(`❌ INSUFFICIENT STOCK for product ${productId}. Cannot decrease by ${quantity}.`);
            throw new Error(`Insufficient stock for product ${productId}. Cannot fulfill order.`);
        }
        console.error(`❌ Error decreasing stock for product ${productId}:`, error);
        throw error;
    }
}