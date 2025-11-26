import { Duration } from "aws-cdk-lib";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { IQueue, Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export interface SwnQueueProps {
  consumer: IFunction;
  inventoryConsumer: IFunction;
  /**
   * Environment name (e.g., 'dev', 'prod')
   * @default 'dev'
   */
  environment?: string;
}

export class SwnQueue extends Construct {

  public readonly orderQueue: IQueue;
  public readonly inventoryQueue: IQueue;

  constructor(scope: Construct, id: string, props: SwnQueueProps) {
    super(scope, id);

    const environment = props.environment || 'dev';
    const isProd = environment === 'prod';

    // Dead letter queue
    const orderDeadLetterQueue = new Queue(this, 'orderDeadLetterQueue', {
      queueName: 'order-dead-letter-queue',
      retentionPeriod: Duration.days(14),
      deliveryDelay: Duration.seconds(0),
    });

    // Main order queue
    this.orderQueue = new Queue(this, 'orderQueue', {
      queueName: 'order-queue',
      visibilityTimeout: Duration.seconds(30),
      receiveMessageWaitTime: Duration.seconds(20), // Long polling
      retentionPeriod: Duration.days(isProd ? 14 : 4),
      deadLetterQueue: {
        maxReceiveCount: 3,
        queue: orderDeadLetterQueue
      }
    });

    // Configure Lambda to consume from SQS
    props.consumer.addEventSource(new SqsEventSource(this.orderQueue, {
      batchSize: 10,
      maxBatchingWindow: Duration.seconds(5),
      reportBatchItemFailures: true, // Enable partial batch failures
    }));

    const inventoryDeadLetterQueue = new Queue(this, 'inventoryDeadLetterQueue', {
      queueName: 'inventory-dead-letter-queue',
      retentionPeriod: Duration.days(14),
    });

    this.inventoryQueue = new Queue(this, 'inventoryQueue', {
      queueName: 'inventory-queue',
      visibilityTimeout: Duration.seconds(30),
      receiveMessageWaitTime: Duration.seconds(20),
      retentionPeriod: Duration.days(isProd ? 14 : 4),
      deadLetterQueue: {
        maxReceiveCount: 3,
        queue: inventoryDeadLetterQueue
      }
    });

    props.inventoryConsumer.addEventSource(new SqsEventSource(this.inventoryQueue, {
      batchSize: 10,
      maxBatchingWindow: Duration.seconds(5),
      reportBatchItemFailures: true,
    }));

  }
}