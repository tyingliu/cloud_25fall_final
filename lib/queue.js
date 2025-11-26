"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwnQueue = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_lambda_event_sources_1 = require("aws-cdk-lib/aws-lambda-event-sources");
const aws_sqs_1 = require("aws-cdk-lib/aws-sqs");
const constructs_1 = require("constructs");
class SwnQueue extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const environment = props.environment || 'dev';
        const isProd = environment === 'prod';
        // Dead letter queue
        const orderDeadLetterQueue = new aws_sqs_1.Queue(this, 'orderDeadLetterQueue', {
            queueName: 'order-dead-letter-queue',
            retentionPeriod: aws_cdk_lib_1.Duration.days(14),
            deliveryDelay: aws_cdk_lib_1.Duration.seconds(0),
        });
        // Main order queue
        this.orderQueue = new aws_sqs_1.Queue(this, 'orderQueue', {
            queueName: 'order-queue',
            visibilityTimeout: aws_cdk_lib_1.Duration.seconds(30),
            receiveMessageWaitTime: aws_cdk_lib_1.Duration.seconds(20), // Long polling
            retentionPeriod: aws_cdk_lib_1.Duration.days(isProd ? 14 : 4),
            deadLetterQueue: {
                maxReceiveCount: 3,
                queue: orderDeadLetterQueue
            }
        });
        // Configure Lambda to consume from SQS
        props.consumer.addEventSource(new aws_lambda_event_sources_1.SqsEventSource(this.orderQueue, {
            batchSize: 10,
            maxBatchingWindow: aws_cdk_lib_1.Duration.seconds(5),
            reportBatchItemFailures: true, // Enable partial batch failures
        }));
        const inventoryDeadLetterQueue = new aws_sqs_1.Queue(this, 'inventoryDeadLetterQueue', {
            queueName: 'inventory-dead-letter-queue',
            retentionPeriod: aws_cdk_lib_1.Duration.days(14),
        });
        this.inventoryQueue = new aws_sqs_1.Queue(this, 'inventoryQueue', {
            queueName: 'inventory-queue',
            visibilityTimeout: aws_cdk_lib_1.Duration.seconds(30),
            receiveMessageWaitTime: aws_cdk_lib_1.Duration.seconds(20),
            retentionPeriod: aws_cdk_lib_1.Duration.days(isProd ? 14 : 4),
            deadLetterQueue: {
                maxReceiveCount: 3,
                queue: inventoryDeadLetterQueue
            }
        });
        props.inventoryConsumer.addEventSource(new aws_lambda_event_sources_1.SqsEventSource(this.inventoryQueue, {
            batchSize: 10,
            maxBatchingWindow: aws_cdk_lib_1.Duration.seconds(5),
            reportBatchItemFailures: true,
        }));
    }
}
exports.SwnQueue = SwnQueue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJxdWV1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBdUM7QUFFdkMsbUZBQXNFO0FBQ3RFLGlEQUFvRDtBQUNwRCwyQ0FBdUM7QUFZdkMsTUFBYSxRQUFTLFNBQVEsc0JBQVM7SUFLckMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFvQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLElBQUksS0FBSyxDQUFDO1FBQy9DLE1BQU0sTUFBTSxHQUFHLFdBQVcsS0FBSyxNQUFNLENBQUM7UUFFdEMsb0JBQW9CO1FBQ3BCLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxlQUFLLENBQUMsSUFBSSxFQUFFLHNCQUFzQixFQUFFO1lBQ25FLFNBQVMsRUFBRSx5QkFBeUI7WUFDcEMsZUFBZSxFQUFFLHNCQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNsQyxhQUFhLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ25DLENBQUMsQ0FBQztRQUVILG1CQUFtQjtRQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksZUFBSyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDOUMsU0FBUyxFQUFFLGFBQWE7WUFDeEIsaUJBQWlCLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ3ZDLHNCQUFzQixFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLGVBQWU7WUFDN0QsZUFBZSxFQUFFLHNCQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0MsZUFBZSxFQUFFO2dCQUNmLGVBQWUsRUFBRSxDQUFDO2dCQUNsQixLQUFLLEVBQUUsb0JBQW9CO2FBQzVCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsdUNBQXVDO1FBQ3ZDLEtBQUssQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUkseUNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2hFLFNBQVMsRUFBRSxFQUFFO1lBQ2IsaUJBQWlCLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLHVCQUF1QixFQUFFLElBQUksRUFBRSxnQ0FBZ0M7U0FDaEUsQ0FBQyxDQUFDLENBQUM7UUFFSixNQUFNLHdCQUF3QixHQUFHLElBQUksZUFBSyxDQUFDLElBQUksRUFBRSwwQkFBMEIsRUFBRTtZQUMzRSxTQUFTLEVBQUUsNkJBQTZCO1lBQ3hDLGVBQWUsRUFBRSxzQkFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7U0FDbkMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGVBQUssQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDdEQsU0FBUyxFQUFFLGlCQUFpQjtZQUM1QixpQkFBaUIsRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDdkMsc0JBQXNCLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQzVDLGVBQWUsRUFBRSxzQkFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9DLGVBQWUsRUFBRTtnQkFDZixlQUFlLEVBQUUsQ0FBQztnQkFDbEIsS0FBSyxFQUFFLHdCQUF3QjthQUNoQztTQUNGLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsSUFBSSx5Q0FBYyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDN0UsU0FBUyxFQUFFLEVBQUU7WUFDYixpQkFBaUIsRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDdEMsdUJBQXVCLEVBQUUsSUFBSTtTQUM5QixDQUFDLENBQUMsQ0FBQztJQUVOLENBQUM7Q0FDRjtBQTVERCw0QkE0REMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEdXJhdGlvbiB9IGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgSUZ1bmN0aW9uIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGFcIjtcbmltcG9ydCB7IFNxc0V2ZW50U291cmNlIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGEtZXZlbnQtc291cmNlc1wiO1xuaW1wb3J0IHsgSVF1ZXVlLCBRdWV1ZSB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3Mtc3FzXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN3blF1ZXVlUHJvcHMge1xuICBjb25zdW1lcjogSUZ1bmN0aW9uO1xuICBpbnZlbnRvcnlDb25zdW1lcjogSUZ1bmN0aW9uO1xuICAvKipcbiAgICogRW52aXJvbm1lbnQgbmFtZSAoZS5nLiwgJ2RldicsICdwcm9kJylcbiAgICogQGRlZmF1bHQgJ2RldidcbiAgICovXG4gIGVudmlyb25tZW50Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgU3duUXVldWUgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gIHB1YmxpYyByZWFkb25seSBvcmRlclF1ZXVlOiBJUXVldWU7XG4gIHB1YmxpYyByZWFkb25seSBpbnZlbnRvcnlRdWV1ZTogSVF1ZXVlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTd25RdWV1ZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IGVudmlyb25tZW50ID0gcHJvcHMuZW52aXJvbm1lbnQgfHwgJ2Rldic7XG4gICAgY29uc3QgaXNQcm9kID0gZW52aXJvbm1lbnQgPT09ICdwcm9kJztcblxuICAgIC8vIERlYWQgbGV0dGVyIHF1ZXVlXG4gICAgY29uc3Qgb3JkZXJEZWFkTGV0dGVyUXVldWUgPSBuZXcgUXVldWUodGhpcywgJ29yZGVyRGVhZExldHRlclF1ZXVlJywge1xuICAgICAgcXVldWVOYW1lOiAnb3JkZXItZGVhZC1sZXR0ZXItcXVldWUnLFxuICAgICAgcmV0ZW50aW9uUGVyaW9kOiBEdXJhdGlvbi5kYXlzKDE0KSxcbiAgICAgIGRlbGl2ZXJ5RGVsYXk6IER1cmF0aW9uLnNlY29uZHMoMCksXG4gICAgfSk7XG5cbiAgICAvLyBNYWluIG9yZGVyIHF1ZXVlXG4gICAgdGhpcy5vcmRlclF1ZXVlID0gbmV3IFF1ZXVlKHRoaXMsICdvcmRlclF1ZXVlJywge1xuICAgICAgcXVldWVOYW1lOiAnb3JkZXItcXVldWUnLFxuICAgICAgdmlzaWJpbGl0eVRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoMzApLFxuICAgICAgcmVjZWl2ZU1lc3NhZ2VXYWl0VGltZTogRHVyYXRpb24uc2Vjb25kcygyMCksIC8vIExvbmcgcG9sbGluZ1xuICAgICAgcmV0ZW50aW9uUGVyaW9kOiBEdXJhdGlvbi5kYXlzKGlzUHJvZCA/IDE0IDogNCksXG4gICAgICBkZWFkTGV0dGVyUXVldWU6IHtcbiAgICAgICAgbWF4UmVjZWl2ZUNvdW50OiAzLFxuICAgICAgICBxdWV1ZTogb3JkZXJEZWFkTGV0dGVyUXVldWVcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIENvbmZpZ3VyZSBMYW1iZGEgdG8gY29uc3VtZSBmcm9tIFNRU1xuICAgIHByb3BzLmNvbnN1bWVyLmFkZEV2ZW50U291cmNlKG5ldyBTcXNFdmVudFNvdXJjZSh0aGlzLm9yZGVyUXVldWUsIHtcbiAgICAgIGJhdGNoU2l6ZTogMTAsXG4gICAgICBtYXhCYXRjaGluZ1dpbmRvdzogRHVyYXRpb24uc2Vjb25kcyg1KSxcbiAgICAgIHJlcG9ydEJhdGNoSXRlbUZhaWx1cmVzOiB0cnVlLCAvLyBFbmFibGUgcGFydGlhbCBiYXRjaCBmYWlsdXJlc1xuICAgIH0pKTtcblxuICAgIGNvbnN0IGludmVudG9yeURlYWRMZXR0ZXJRdWV1ZSA9IG5ldyBRdWV1ZSh0aGlzLCAnaW52ZW50b3J5RGVhZExldHRlclF1ZXVlJywge1xuICAgICAgcXVldWVOYW1lOiAnaW52ZW50b3J5LWRlYWQtbGV0dGVyLXF1ZXVlJyxcbiAgICAgIHJldGVudGlvblBlcmlvZDogRHVyYXRpb24uZGF5cygxNCksXG4gICAgfSk7XG5cbiAgICB0aGlzLmludmVudG9yeVF1ZXVlID0gbmV3IFF1ZXVlKHRoaXMsICdpbnZlbnRvcnlRdWV1ZScsIHtcbiAgICAgIHF1ZXVlTmFtZTogJ2ludmVudG9yeS1xdWV1ZScsXG4gICAgICB2aXNpYmlsaXR5VGltZW91dDogRHVyYXRpb24uc2Vjb25kcygzMCksXG4gICAgICByZWNlaXZlTWVzc2FnZVdhaXRUaW1lOiBEdXJhdGlvbi5zZWNvbmRzKDIwKSxcbiAgICAgIHJldGVudGlvblBlcmlvZDogRHVyYXRpb24uZGF5cyhpc1Byb2QgPyAxNCA6IDQpLFxuICAgICAgZGVhZExldHRlclF1ZXVlOiB7XG4gICAgICAgIG1heFJlY2VpdmVDb3VudDogMyxcbiAgICAgICAgcXVldWU6IGludmVudG9yeURlYWRMZXR0ZXJRdWV1ZVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcHJvcHMuaW52ZW50b3J5Q29uc3VtZXIuYWRkRXZlbnRTb3VyY2UobmV3IFNxc0V2ZW50U291cmNlKHRoaXMuaW52ZW50b3J5UXVldWUsIHtcbiAgICAgIGJhdGNoU2l6ZTogMTAsXG4gICAgICBtYXhCYXRjaGluZ1dpbmRvdzogRHVyYXRpb24uc2Vjb25kcyg1KSxcbiAgICAgIHJlcG9ydEJhdGNoSXRlbUZhaWx1cmVzOiB0cnVlLFxuICAgIH0pKTtcblxuICB9XG59Il19