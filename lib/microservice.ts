import { Duration } from "aws-cdk-lib";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { join } from "path";

export interface SwnMicroservicesProps {
  productTable: ITable;
  basketTable: ITable;
  orderTable: ITable;
  /**
   * Environment name (e.g., 'dev', 'prod')
   * @default 'dev'
   */
  environment?: string;
}

export class SwnMicroservices extends Construct {

  public readonly productMicroservice: NodejsFunction;
  public readonly basketMicroservice: NodejsFunction;
  public readonly orderingMicroservice: NodejsFunction;
  public readonly inventoryMicroservice: NodejsFunction;

  constructor(scope: Construct, id: string, props: SwnMicroservicesProps) {
    super(scope, id);

    const environment = props.environment || 'dev';
    const isProd = environment === 'prod';

    // Product microservices
    this.productMicroservice = this.createProductFunction(props.productTable, isProd);
    // Basket microservices
    this.basketMicroservice = this.createBasketFunction(props.basketTable, isProd);
    // Ordering Microservice
    this.orderingMicroservice = this.createOrderingFunction(props.orderTable, isProd);
    // Inventory Microservice
    this.inventoryMicroservice = this.createInventoryFunction(props.productTable, isProd)
  }

  private createProductFunction(productTable: ITable, isProd: boolean): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          '@aws-sdk/*'
        ],
        minify: true,
        sourceMap: !isProd, // Source maps for debugging in dev
      },
      environment: {
        PRIMARY_KEY: 'id',
        DYNAMODB_TABLE_NAME: productTable.tableName,
        NODE_ENV: isProd ? 'production' : 'development'
      },
      runtime: Runtime.NODEJS_20_X,
      timeout: Duration.seconds(30),
      memorySize: isProd ? 512 : 256,
      tracing: Tracing.ACTIVE,
      logRetention: isProd ? RetentionDays.ONE_MONTH : RetentionDays.ONE_WEEK,
      description: 'Product microservice Lambda function',
    };

    // Product microservices lambda function
    const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
      entry: join(__dirname, `/../src/product/index.js`),
      ...nodeJsFunctionProps,
      functionName: 'ProductMicroservice',
    });

    productTable.grantReadWriteData(productFunction);

    return productFunction;
  }

  private createBasketFunction(basketTable: ITable, isProd: boolean): NodejsFunction {
    const basketFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          '@aws-sdk/*'
        ],
        minify: true,
        sourceMap: !isProd,
      },
      environment: {
        PRIMARY_KEY: 'userName',
        DYNAMODB_TABLE_NAME: basketTable.tableName,
        EVENT_SOURCE: "com.swn.basket.checkoutbasket",
        EVENT_DETAILTYPE: "CheckoutBasket",
        EVENT_BUSNAME: "SwnEventBus",
        NODE_ENV: isProd ? 'production' : 'development'
      },
      runtime: Runtime.NODEJS_20_X,
      timeout: Duration.seconds(30),
      memorySize: isProd ? 512 : 256,
      tracing: Tracing.ACTIVE,
      logRetention: isProd ? RetentionDays.ONE_MONTH : RetentionDays.ONE_WEEK,
      description: 'Basket microservice Lambda function with EventBridge integration',
    };

    const basketFunction = new NodejsFunction(this, 'basketLambdaFunction', {
      entry: join(__dirname, `/../src/basket/index.js`),
      ...basketFunctionProps,
      functionName: 'BasketMicroservice',
    });

    basketTable.grantReadWriteData(basketFunction);
    return basketFunction;
  }

  private createOrderingFunction(orderTable: ITable, isProd: boolean): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          '@aws-sdk/*'
        ],
        minify: true,
        sourceMap: !isProd,
      },
      environment: {
        PRIMARY_KEY: 'userName',
        SORT_KEY: 'orderDate',
        DYNAMODB_TABLE_NAME: orderTable.tableName,
        NODE_ENV: isProd ? 'production' : 'development'
      },
      runtime: Runtime.NODEJS_20_X,
      timeout: Duration.seconds(30),
      memorySize: isProd ? 512 : 256,
      tracing: Tracing.ACTIVE,
      logRetention: isProd ? RetentionDays.ONE_MONTH : RetentionDays.ONE_WEEK,
      reservedConcurrentExecutions: isProd ? 10 : undefined, // Limit concurrency in prod
      description: 'Ordering microservice Lambda function',
    };

    const orderFunction = new NodejsFunction(this, 'orderingLambdaFunction', {
      entry: join(__dirname, `/../src/ordering/index.js`),
      ...nodeJsFunctionProps,
      functionName: 'OrderingMicroservice',
    });

    orderTable.grantReadWriteData(orderFunction);
    return orderFunction;
  }

  private createInventoryFunction(productTable: ITable, isProd: boolean): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ['@aws-sdk/*'],
        minify: true,
        sourceMap: !isProd,
      },
      environment: {
        PRIMARY_KEY: 'id',  // Use product table's primary key
        DYNAMODB_TABLE_NAME: productTable.tableName,  // Use product table
        NODE_ENV: isProd ? 'production' : 'development'
      },
      runtime: Runtime.NODEJS_20_X,
      timeout: Duration.seconds(30),
      memorySize: isProd ? 512 : 256,
      tracing: Tracing.ACTIVE,
      logRetention: isProd ? RetentionDays.ONE_MONTH : RetentionDays.ONE_WEEK,
      description: 'Inventory microservice Lambda function (uses Product table)',
    };

    const inventoryFunction = new NodejsFunction(this, 'inventoryLambdaFunction', {
      entry: join(__dirname, `/../src/inventory/index.js`),
      ...nodeJsFunctionProps,
      functionName: 'InventoryMicroservice',
    });

    productTable.grantReadWriteData(inventoryFunction);  // Grant access to product table
    return inventoryFunction;
  }
}