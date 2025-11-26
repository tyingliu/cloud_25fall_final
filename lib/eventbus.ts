import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { EventBus, Rule, Archive } from "aws-cdk-lib/aws-events";
import { SqsQueue } from "aws-cdk-lib/aws-events-targets";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { IQueue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export interface SwnEventBusProps {
    publisherFunction: IFunction;
    targetQueue: IQueue;
    inventoryQueue: IQueue;
    /**
     * Environment name (e.g., 'dev', 'prod')
     * @default 'dev'
     */
    environment?: string;
}

export class SwnEventBus extends Construct {

    public readonly eventBus: EventBus;
    public readonly checkoutBasketRule: Rule;

    constructor(scope: Construct, id: string, props: SwnEventBusProps) {
        super(scope, id);

        const environment = props.environment || 'dev';
        const isProd = environment === 'prod';

        // Event bus
        this.eventBus = new EventBus(this, 'SwnEventBus', {
            eventBusName: 'SwnEventBus'
        });

        // Archive for event replay (useful for debugging and disaster recovery)
        const archive = new Archive(this, 'SwnEventArchive', {
            sourceEventBus: this.eventBus,
            archiveName: 'SwnEventArchive',
            description: 'Archive for SWN EventBus events',
            retention: isProd ? Duration.days(30) : Duration.days(7),
            eventPattern: {
                source: ['com.swn.basket.checkoutbasket']
            }
        });

        // Checkout basket rule
        this.checkoutBasketRule = new Rule(this, 'CheckoutBasketRule', {
            eventBus: this.eventBus,
            enabled: true,
            description: 'When Basket microservice checkout the basket',
            eventPattern: {
                source: ['com.swn.basket.checkoutbasket'],
                detailType: ['CheckoutBasket']
            },
            ruleName: 'CheckoutBasketRule'
        });

        // Add SQS queue as target with dead letter queue handling
        this.checkoutBasketRule.addTarget(new SqsQueue(props.targetQueue, {
            // Retry configuration
            maxEventAge: Duration.hours(24),
            retryAttempts: 3,
            // Message will be sent to queue with event details
        }));

        this.checkoutBasketRule.addTarget(new SqsQueue(props.inventoryQueue, {
            maxEventAge: Duration.hours(24),
            retryAttempts: 3,
        }));

        // Grant permissions to publisher function
        this.eventBus.grantPutEventsTo(props.publisherFunction);
    }
}