// /src/product/index.js

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, UpdateCommand, ScanCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.DYNAMODB_TABLE_NAME;
const primaryKey = process.env.PRIMARY_KEY || 'id';

exports.handler = async function (event) {
  console.log("Request:", JSON.stringify(event, undefined, 2));

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
      },
      body: ''
    };
  }

  try {
    let body;

    switch (event.httpMethod) {
      case "GET":
        if (event.queryStringParameters) {
          // GET /product?category=electronics
          body = await getProductsByCategory(event.queryStringParameters.category);
        } else if (event.pathParameters && event.pathParameters.id) {
          // GET /product/{id}
          body = await getProduct(event.pathParameters.id);
        } else {
          // GET /product
          body = await getAllProducts();
        }
        break;

      case "POST":
        // POST /product
        body = await createProduct(JSON.parse(event.body));
        break;

      case "PUT":
        // PUT /product/{id}
        body = await updateProduct(event.pathParameters.id, JSON.parse(event.body));
        break;

      case "DELETE":
        // DELETE /product/{id}
        body = await deleteProduct(event.pathParameters.id);
        break;

      default:
        throw new Error(`Unsupported method: ${event.httpMethod}`);
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
      },
      body: JSON.stringify(body)
    };

  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: error.statusCode || 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: error.message || "Failed to process request",
        error: error.message
      })
    };
  }
};

// Get a single product
async function getProduct(productId) {
  console.log(`Getting product: ${productId}`);

  try {
    const params = {
      TableName: tableName,
      Key: {
        [primaryKey]: productId
      }
    };

    const { Item } = await ddbDocClient.send(new GetCommand(params));

    if (!Item) {
      const error = new Error(`Product not found: ${productId}`);
      error.statusCode = 404;
      throw error;
    }

    console.log(`Found product: ${productId}`);
    return Item;
  } catch (error) {
    console.error(`Error getting product ${productId}:`, error);
    throw error;
  }
}

// Get all products
async function getAllProducts() {
  console.log("Getting all products");

  try {
    const params = {
      TableName: tableName
    };

    const { Items } = await ddbDocClient.send(new ScanCommand(params));
    console.log(`Found ${Items.length} products`);

    return Items;
  } catch (error) {
    console.error("Error getting all products:", error);
    throw error;
  }
}

// Get products by category
async function getProductsByCategory(category) {
  console.log(`Getting products by category: ${category}`);

  try {
    const params = {
      TableName: tableName,
      FilterExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': category
      }
    };

    const { Items } = await ddbDocClient.send(new ScanCommand(params));
    console.log(`Found ${Items.length} products in category: ${category}`);

    return Items;
  } catch (error) {
    console.error(`Error getting products by category ${category}:`, error);
    throw error;
  }
}

// Create new product
async function createProduct(productData) {
  console.log("Creating product:", productData);

  if (!productData.id) {
    throw new Error("Product id is required");
  }

  try {
    const product = {
      [primaryKey]: productData.id,
      name: productData.name || '',
      description: productData.description || '',
      imageFile: productData.imageFile || '',
      price: productData.price || 0,
      category: productData.category || '',
      // Inventory fields
      availableStock: productData.availableStock || 0,
      reservedStock: productData.reservedStock || 0,
      reorderLevel: productData.reorderLevel || 10,
      lastRestocked: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const params = {
      TableName: tableName,
      Item: product
    };

    await ddbDocClient.send(new PutCommand(params));
    console.log(`Product created: ${productData.id}`);

    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

// Update product
async function updateProduct(productId, updateData) {
  console.log(`Updating product: ${productId}`, updateData);

  try {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    // Build dynamic update expression for product fields
    const fields = ['name', 'description', 'imageFile', 'price', 'category',
      'availableStock', 'reservedStock', 'reorderLevel'];

    fields.forEach(field => {
      if (updateData[field] !== undefined) {
        updateExpressions.push(`#${field} = :${field}`);
        expressionAttributeNames[`#${field}`] = field;
        expressionAttributeValues[`:${field}`] = updateData[field];
      }
    });

    if (updateExpressions.length === 0) {
      throw new Error("No fields to update");
    }

    // Always update lastRestocked if stock fields are updated
    if (updateData.availableStock !== undefined || updateData.reservedStock !== undefined) {
      updateExpressions.push('#lastRestocked = :lastRestocked');
      expressionAttributeNames['#lastRestocked'] = 'lastRestocked';
      expressionAttributeValues[':lastRestocked'] = new Date().toISOString();
    }

    const params = {
      TableName: tableName,
      Key: {
        [primaryKey]: productId
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const { Attributes } = await ddbDocClient.send(new UpdateCommand(params));
    console.log(`Product updated: ${productId}`);

    return Attributes;
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    throw error;
  }
}

// Delete product
async function deleteProduct(productId) {
  console.log(`Deleting product: ${productId}`);

  try {
    const params = {
      TableName: tableName,
      Key: {
        [primaryKey]: productId
      },
      ReturnValues: 'ALL_OLD'
    };

    const { Attributes } = await ddbDocClient.send(new DeleteCommand(params));

    if (!Attributes) {
      const error = new Error(`Product not found: ${productId}`);
      error.statusCode = 404;
      throw error;
    }

    console.log(`Product deleted: ${productId}`);
    return { message: `Product deleted: ${productId}` };
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);
    throw error;
  }
}