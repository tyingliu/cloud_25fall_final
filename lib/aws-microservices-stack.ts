import { Stack, StackProps, CfnOutput, Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SwnApiGateway } from './apigateway';
import { SwnDatabase } from './database';
import { SwnEventBus } from './eventbus';
import { SwnMicroservices } from './microservice';
import { SwnQueue } from './queue';

export interface AwsMicroservicesStackProps extends StackProps {
  /**
   * Environment name (e.g., 'dev', 'staging', 'prod')
   * @default 'dev'
   */
  environment?: string;

  /**
   * Stage name for API Gateway
   * @default 'prod'
   */
  stageName?: string;
}

export class AwsMicroservicesStack extends Stack {

  public readonly apiUrl: string;
  public readonly database: SwnDatabase;
  public readonly microservices: SwnMicroservices;

  constructor(scope: Construct, id: string, props?: AwsMicroservicesStackProps) {
    super(scope, id, props);

    const environment = props?.environment || 'dev';
    const stageName = props?.stageName || 'prod';

    // Add tags to all resources in this stack
    Tags.of(this).add('Environment', environment);
    Tags.of(this).add('Project', 'SWN-Microservices');
    Tags.of(this).add('ManagedBy', 'CDK');

    // Database layer
    this.database = new SwnDatabase(this, 'Database', {
      environment
    });

    // Microservices layer
    this.microservices = new SwnMicroservices(this, 'Microservices', {
      productTable: this.database.productTable,
      basketTable: this.database.basketTable,
      orderTable: this.database.orderTable,
      environment
    });

    // API Gateway layer
    const apigateway = new SwnApiGateway(this, 'ApiGateway', {
      productMicroservice: this.microservices.productMicroservice,
      basketMicroservice: this.microservices.basketMicroservice,
      orderingMicroservices: this.microservices.orderingMicroservice,
      environment,
      stageName
    });

    // Queue layer
    const queue = new SwnQueue(this, 'Queue', {
      consumer: this.microservices.orderingMicroservice,
      inventoryConsumer: this.microservices.inventoryMicroservice,
      environment
    });

    // Event Bus layer
    const eventbus = new SwnEventBus(this, 'EventBus', {
      publisherFunction: this.microservices.basketMicroservice,
      targetQueue: queue.orderQueue,
      inventoryQueue: queue.inventoryQueue,
      environment
    });

    // Store API URL for outputs
    this.apiUrl = apigateway.apiUrl;

    // CloudFormation Outputs
    // new CfnOutput(this, 'ApiGatewayUrl', {
    //   value: this.apiUrl,
    //   description: 'API Gateway endpoint URL',
    //   exportName: `${id}-ApiUrl-${environment}`
    // });

    // new CfnOutput(this, 'ProductTableName', {
    //   value: this.database.productTable.tableName,
    //   description: 'Product DynamoDB table name',
    //   exportName: `${id}-ProductTable-${environment}`
    // });

    // new CfnOutput(this, 'BasketTableName', {
    //   value: this.database.basketTable.tableName,
    //   description: 'Basket DynamoDB table name',
    //   exportName: `${id}-BasketTable-${environment}`
    // });

    // new CfnOutput(this, 'OrderTableName', {
    //   value: this.database.orderTable.tableName,
    //   description: 'Order DynamoDB table name',
    //   exportName: `${id}-OrderTable-${environment}`
    // });

    // new CfnOutput(this, 'EventBusName', {
    //   value: eventbus.eventBus.eventBusName,
    //   description: 'EventBridge bus name',
    //   exportName: `${id}-EventBus-${environment}`
    // });

    // new CfnOutput(this, 'OrderQueueUrl', {
    //   value: queue.orderQueue.queueUrl,
    //   description: 'Order queue URL',
    //   exportName: `${id}-OrderQueueUrl-${environment}`
    // });

    // new CfnOutput(this, 'ProductFunctionName', {
    //   value: this.microservices.productMicroservice.functionName,
    //   description: 'Product Lambda function name',
    //   exportName: `${id}-ProductFunction-${environment}`
    // });

    // new CfnOutput(this, 'BasketFunctionName', {
    //   value: this.microservices.basketMicroservice.functionName,
    //   description: 'Basket Lambda function name',
    //   exportName: `${id}-BasketFunction-${environment}`
    // });

    // new CfnOutput(this, 'OrderingFunctionName', {
    //   value: this.microservices.orderingMicroservice.functionName,
    //   description: 'Ordering Lambda function name',
    //   exportName: `${id}-OrderingFunction-${environment}`
    // });
  }
}