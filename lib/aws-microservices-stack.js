"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsMicroservicesStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const apigateway_1 = require("./apigateway");
const database_1 = require("./database");
const eventbus_1 = require("./eventbus");
const microservice_1 = require("./microservice");
const queue_1 = require("./queue");
class AwsMicroservicesStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const environment = (props === null || props === void 0 ? void 0 : props.environment) || 'dev';
        const stageName = (props === null || props === void 0 ? void 0 : props.stageName) || 'prod';
        // Add tags to all resources in this stack
        aws_cdk_lib_1.Tags.of(this).add('Environment', environment);
        aws_cdk_lib_1.Tags.of(this).add('Project', 'SWN-Microservices');
        aws_cdk_lib_1.Tags.of(this).add('ManagedBy', 'CDK');
        // Database layer
        this.database = new database_1.SwnDatabase(this, 'Database', {
            environment
        });
        // Microservices layer
        this.microservices = new microservice_1.SwnMicroservices(this, 'Microservices', {
            productTable: this.database.productTable,
            basketTable: this.database.basketTable,
            orderTable: this.database.orderTable,
            environment
        });
        // API Gateway layer
        const apigateway = new apigateway_1.SwnApiGateway(this, 'ApiGateway', {
            productMicroservice: this.microservices.productMicroservice,
            basketMicroservice: this.microservices.basketMicroservice,
            orderingMicroservices: this.microservices.orderingMicroservice,
            environment,
            stageName
        });
        // Queue layer
        const queue = new queue_1.SwnQueue(this, 'Queue', {
            consumer: this.microservices.orderingMicroservice,
            inventoryConsumer: this.microservices.inventoryMicroservice,
            environment
        });
        // Event Bus layer
        const eventbus = new eventbus_1.SwnEventBus(this, 'EventBus', {
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
exports.AwsMicroservicesStack = AwsMicroservicesStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLW1pY3Jvc2VydmljZXMtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhd3MtbWljcm9zZXJ2aWNlcy1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBaUU7QUFFakUsNkNBQTZDO0FBQzdDLHlDQUF5QztBQUN6Qyx5Q0FBeUM7QUFDekMsaURBQWtEO0FBQ2xELG1DQUFtQztBQWdCbkMsTUFBYSxxQkFBc0IsU0FBUSxtQkFBSztJQU05QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtDO1FBQzFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sV0FBVyxHQUFHLENBQUEsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFdBQVcsS0FBSSxLQUFLLENBQUM7UUFDaEQsTUFBTSxTQUFTLEdBQUcsQ0FBQSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsU0FBUyxLQUFJLE1BQU0sQ0FBQztRQUU3QywwQ0FBMEM7UUFDMUMsa0JBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUM5QyxrQkFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFDbEQsa0JBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV0QyxpQkFBaUI7UUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLHNCQUFXLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNoRCxXQUFXO1NBQ1osQ0FBQyxDQUFDO1FBRUgsc0JBQXNCO1FBQ3RCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSwrQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQy9ELFlBQVksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVk7WUFDeEMsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVztZQUN0QyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVO1lBQ3BDLFdBQVc7U0FDWixDQUFDLENBQUM7UUFFSCxvQkFBb0I7UUFDcEIsTUFBTSxVQUFVLEdBQUcsSUFBSSwwQkFBYSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDdkQsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUI7WUFDM0Qsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0I7WUFDekQscUJBQXFCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0I7WUFDOUQsV0FBVztZQUNYLFNBQVM7U0FDVixDQUFDLENBQUM7UUFFSCxjQUFjO1FBQ2QsTUFBTSxLQUFLLEdBQUcsSUFBSSxnQkFBUSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDeEMsUUFBUSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CO1lBQ2pELGlCQUFpQixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCO1lBQzNELFdBQVc7U0FDWixDQUFDLENBQUM7UUFFSCxrQkFBa0I7UUFDbEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxzQkFBVyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDakQsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0I7WUFDeEQsV0FBVyxFQUFFLEtBQUssQ0FBQyxVQUFVO1lBQzdCLGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYztZQUNwQyxXQUFXO1NBQ1osQ0FBQyxDQUFDO1FBRUgsNEJBQTRCO1FBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUVoQyx5QkFBeUI7UUFDekIseUNBQXlDO1FBQ3pDLHdCQUF3QjtRQUN4Qiw2Q0FBNkM7UUFDN0MsOENBQThDO1FBQzlDLE1BQU07UUFFTiw0Q0FBNEM7UUFDNUMsaURBQWlEO1FBQ2pELGdEQUFnRDtRQUNoRCxvREFBb0Q7UUFDcEQsTUFBTTtRQUVOLDJDQUEyQztRQUMzQyxnREFBZ0Q7UUFDaEQsK0NBQStDO1FBQy9DLG1EQUFtRDtRQUNuRCxNQUFNO1FBRU4sMENBQTBDO1FBQzFDLCtDQUErQztRQUMvQyw4Q0FBOEM7UUFDOUMsa0RBQWtEO1FBQ2xELE1BQU07UUFFTix3Q0FBd0M7UUFDeEMsMkNBQTJDO1FBQzNDLHlDQUF5QztRQUN6QyxnREFBZ0Q7UUFDaEQsTUFBTTtRQUVOLHlDQUF5QztRQUN6QyxzQ0FBc0M7UUFDdEMsb0NBQW9DO1FBQ3BDLHFEQUFxRDtRQUNyRCxNQUFNO1FBRU4sK0NBQStDO1FBQy9DLGdFQUFnRTtRQUNoRSxpREFBaUQ7UUFDakQsdURBQXVEO1FBQ3ZELE1BQU07UUFFTiw4Q0FBOEM7UUFDOUMsK0RBQStEO1FBQy9ELGdEQUFnRDtRQUNoRCxzREFBc0Q7UUFDdEQsTUFBTTtRQUVOLGdEQUFnRDtRQUNoRCxpRUFBaUU7UUFDakUsa0RBQWtEO1FBQ2xELHdEQUF3RDtRQUN4RCxNQUFNO0lBQ1IsQ0FBQztDQUNGO0FBaEhELHNEQWdIQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrLCBTdGFja1Byb3BzLCBDZm5PdXRwdXQsIFRhZ3MgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFN3bkFwaUdhdGV3YXkgfSBmcm9tICcuL2FwaWdhdGV3YXknO1xuaW1wb3J0IHsgU3duRGF0YWJhc2UgfSBmcm9tICcuL2RhdGFiYXNlJztcbmltcG9ydCB7IFN3bkV2ZW50QnVzIH0gZnJvbSAnLi9ldmVudGJ1cyc7XG5pbXBvcnQgeyBTd25NaWNyb3NlcnZpY2VzIH0gZnJvbSAnLi9taWNyb3NlcnZpY2UnO1xuaW1wb3J0IHsgU3duUXVldWUgfSBmcm9tICcuL3F1ZXVlJztcblxuZXhwb3J0IGludGVyZmFjZSBBd3NNaWNyb3NlcnZpY2VzU3RhY2tQcm9wcyBleHRlbmRzIFN0YWNrUHJvcHMge1xuICAvKipcbiAgICogRW52aXJvbm1lbnQgbmFtZSAoZS5nLiwgJ2RldicsICdzdGFnaW5nJywgJ3Byb2QnKVxuICAgKiBAZGVmYXVsdCAnZGV2J1xuICAgKi9cbiAgZW52aXJvbm1lbnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFN0YWdlIG5hbWUgZm9yIEFQSSBHYXRld2F5XG4gICAqIEBkZWZhdWx0ICdwcm9kJ1xuICAgKi9cbiAgc3RhZ2VOYW1lPzogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgQXdzTWljcm9zZXJ2aWNlc1N0YWNrIGV4dGVuZHMgU3RhY2sge1xuXG4gIHB1YmxpYyByZWFkb25seSBhcGlVcmw6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGRhdGFiYXNlOiBTd25EYXRhYmFzZTtcbiAgcHVibGljIHJlYWRvbmx5IG1pY3Jvc2VydmljZXM6IFN3bk1pY3Jvc2VydmljZXM7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBBd3NNaWNyb3NlcnZpY2VzU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgZW52aXJvbm1lbnQgPSBwcm9wcz8uZW52aXJvbm1lbnQgfHwgJ2Rldic7XG4gICAgY29uc3Qgc3RhZ2VOYW1lID0gcHJvcHM/LnN0YWdlTmFtZSB8fCAncHJvZCc7XG5cbiAgICAvLyBBZGQgdGFncyB0byBhbGwgcmVzb3VyY2VzIGluIHRoaXMgc3RhY2tcbiAgICBUYWdzLm9mKHRoaXMpLmFkZCgnRW52aXJvbm1lbnQnLCBlbnZpcm9ubWVudCk7XG4gICAgVGFncy5vZih0aGlzKS5hZGQoJ1Byb2plY3QnLCAnU1dOLU1pY3Jvc2VydmljZXMnKTtcbiAgICBUYWdzLm9mKHRoaXMpLmFkZCgnTWFuYWdlZEJ5JywgJ0NESycpO1xuXG4gICAgLy8gRGF0YWJhc2UgbGF5ZXJcbiAgICB0aGlzLmRhdGFiYXNlID0gbmV3IFN3bkRhdGFiYXNlKHRoaXMsICdEYXRhYmFzZScsIHtcbiAgICAgIGVudmlyb25tZW50XG4gICAgfSk7XG5cbiAgICAvLyBNaWNyb3NlcnZpY2VzIGxheWVyXG4gICAgdGhpcy5taWNyb3NlcnZpY2VzID0gbmV3IFN3bk1pY3Jvc2VydmljZXModGhpcywgJ01pY3Jvc2VydmljZXMnLCB7XG4gICAgICBwcm9kdWN0VGFibGU6IHRoaXMuZGF0YWJhc2UucHJvZHVjdFRhYmxlLFxuICAgICAgYmFza2V0VGFibGU6IHRoaXMuZGF0YWJhc2UuYmFza2V0VGFibGUsXG4gICAgICBvcmRlclRhYmxlOiB0aGlzLmRhdGFiYXNlLm9yZGVyVGFibGUsXG4gICAgICBlbnZpcm9ubWVudFxuICAgIH0pO1xuXG4gICAgLy8gQVBJIEdhdGV3YXkgbGF5ZXJcbiAgICBjb25zdCBhcGlnYXRld2F5ID0gbmV3IFN3bkFwaUdhdGV3YXkodGhpcywgJ0FwaUdhdGV3YXknLCB7XG4gICAgICBwcm9kdWN0TWljcm9zZXJ2aWNlOiB0aGlzLm1pY3Jvc2VydmljZXMucHJvZHVjdE1pY3Jvc2VydmljZSxcbiAgICAgIGJhc2tldE1pY3Jvc2VydmljZTogdGhpcy5taWNyb3NlcnZpY2VzLmJhc2tldE1pY3Jvc2VydmljZSxcbiAgICAgIG9yZGVyaW5nTWljcm9zZXJ2aWNlczogdGhpcy5taWNyb3NlcnZpY2VzLm9yZGVyaW5nTWljcm9zZXJ2aWNlLFxuICAgICAgZW52aXJvbm1lbnQsXG4gICAgICBzdGFnZU5hbWVcbiAgICB9KTtcblxuICAgIC8vIFF1ZXVlIGxheWVyXG4gICAgY29uc3QgcXVldWUgPSBuZXcgU3duUXVldWUodGhpcywgJ1F1ZXVlJywge1xuICAgICAgY29uc3VtZXI6IHRoaXMubWljcm9zZXJ2aWNlcy5vcmRlcmluZ01pY3Jvc2VydmljZSxcbiAgICAgIGludmVudG9yeUNvbnN1bWVyOiB0aGlzLm1pY3Jvc2VydmljZXMuaW52ZW50b3J5TWljcm9zZXJ2aWNlLFxuICAgICAgZW52aXJvbm1lbnRcbiAgICB9KTtcblxuICAgIC8vIEV2ZW50IEJ1cyBsYXllclxuICAgIGNvbnN0IGV2ZW50YnVzID0gbmV3IFN3bkV2ZW50QnVzKHRoaXMsICdFdmVudEJ1cycsIHtcbiAgICAgIHB1Ymxpc2hlckZ1bmN0aW9uOiB0aGlzLm1pY3Jvc2VydmljZXMuYmFza2V0TWljcm9zZXJ2aWNlLFxuICAgICAgdGFyZ2V0UXVldWU6IHF1ZXVlLm9yZGVyUXVldWUsXG4gICAgICBpbnZlbnRvcnlRdWV1ZTogcXVldWUuaW52ZW50b3J5UXVldWUsXG4gICAgICBlbnZpcm9ubWVudFxuICAgIH0pO1xuXG4gICAgLy8gU3RvcmUgQVBJIFVSTCBmb3Igb3V0cHV0c1xuICAgIHRoaXMuYXBpVXJsID0gYXBpZ2F0ZXdheS5hcGlVcmw7XG5cbiAgICAvLyBDbG91ZEZvcm1hdGlvbiBPdXRwdXRzXG4gICAgLy8gbmV3IENmbk91dHB1dCh0aGlzLCAnQXBpR2F0ZXdheVVybCcsIHtcbiAgICAvLyAgIHZhbHVlOiB0aGlzLmFwaVVybCxcbiAgICAvLyAgIGRlc2NyaXB0aW9uOiAnQVBJIEdhdGV3YXkgZW5kcG9pbnQgVVJMJyxcbiAgICAvLyAgIGV4cG9ydE5hbWU6IGAke2lkfS1BcGlVcmwtJHtlbnZpcm9ubWVudH1gXG4gICAgLy8gfSk7XG5cbiAgICAvLyBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdQcm9kdWN0VGFibGVOYW1lJywge1xuICAgIC8vICAgdmFsdWU6IHRoaXMuZGF0YWJhc2UucHJvZHVjdFRhYmxlLnRhYmxlTmFtZSxcbiAgICAvLyAgIGRlc2NyaXB0aW9uOiAnUHJvZHVjdCBEeW5hbW9EQiB0YWJsZSBuYW1lJyxcbiAgICAvLyAgIGV4cG9ydE5hbWU6IGAke2lkfS1Qcm9kdWN0VGFibGUtJHtlbnZpcm9ubWVudH1gXG4gICAgLy8gfSk7XG5cbiAgICAvLyBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdCYXNrZXRUYWJsZU5hbWUnLCB7XG4gICAgLy8gICB2YWx1ZTogdGhpcy5kYXRhYmFzZS5iYXNrZXRUYWJsZS50YWJsZU5hbWUsXG4gICAgLy8gICBkZXNjcmlwdGlvbjogJ0Jhc2tldCBEeW5hbW9EQiB0YWJsZSBuYW1lJyxcbiAgICAvLyAgIGV4cG9ydE5hbWU6IGAke2lkfS1CYXNrZXRUYWJsZS0ke2Vudmlyb25tZW50fWBcbiAgICAvLyB9KTtcblxuICAgIC8vIG5ldyBDZm5PdXRwdXQodGhpcywgJ09yZGVyVGFibGVOYW1lJywge1xuICAgIC8vICAgdmFsdWU6IHRoaXMuZGF0YWJhc2Uub3JkZXJUYWJsZS50YWJsZU5hbWUsXG4gICAgLy8gICBkZXNjcmlwdGlvbjogJ09yZGVyIER5bmFtb0RCIHRhYmxlIG5hbWUnLFxuICAgIC8vICAgZXhwb3J0TmFtZTogYCR7aWR9LU9yZGVyVGFibGUtJHtlbnZpcm9ubWVudH1gXG4gICAgLy8gfSk7XG5cbiAgICAvLyBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdFdmVudEJ1c05hbWUnLCB7XG4gICAgLy8gICB2YWx1ZTogZXZlbnRidXMuZXZlbnRCdXMuZXZlbnRCdXNOYW1lLFxuICAgIC8vICAgZGVzY3JpcHRpb246ICdFdmVudEJyaWRnZSBidXMgbmFtZScsXG4gICAgLy8gICBleHBvcnROYW1lOiBgJHtpZH0tRXZlbnRCdXMtJHtlbnZpcm9ubWVudH1gXG4gICAgLy8gfSk7XG5cbiAgICAvLyBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdPcmRlclF1ZXVlVXJsJywge1xuICAgIC8vICAgdmFsdWU6IHF1ZXVlLm9yZGVyUXVldWUucXVldWVVcmwsXG4gICAgLy8gICBkZXNjcmlwdGlvbjogJ09yZGVyIHF1ZXVlIFVSTCcsXG4gICAgLy8gICBleHBvcnROYW1lOiBgJHtpZH0tT3JkZXJRdWV1ZVVybC0ke2Vudmlyb25tZW50fWBcbiAgICAvLyB9KTtcblxuICAgIC8vIG5ldyBDZm5PdXRwdXQodGhpcywgJ1Byb2R1Y3RGdW5jdGlvbk5hbWUnLCB7XG4gICAgLy8gICB2YWx1ZTogdGhpcy5taWNyb3NlcnZpY2VzLnByb2R1Y3RNaWNyb3NlcnZpY2UuZnVuY3Rpb25OYW1lLFxuICAgIC8vICAgZGVzY3JpcHRpb246ICdQcm9kdWN0IExhbWJkYSBmdW5jdGlvbiBuYW1lJyxcbiAgICAvLyAgIGV4cG9ydE5hbWU6IGAke2lkfS1Qcm9kdWN0RnVuY3Rpb24tJHtlbnZpcm9ubWVudH1gXG4gICAgLy8gfSk7XG5cbiAgICAvLyBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdCYXNrZXRGdW5jdGlvbk5hbWUnLCB7XG4gICAgLy8gICB2YWx1ZTogdGhpcy5taWNyb3NlcnZpY2VzLmJhc2tldE1pY3Jvc2VydmljZS5mdW5jdGlvbk5hbWUsXG4gICAgLy8gICBkZXNjcmlwdGlvbjogJ0Jhc2tldCBMYW1iZGEgZnVuY3Rpb24gbmFtZScsXG4gICAgLy8gICBleHBvcnROYW1lOiBgJHtpZH0tQmFza2V0RnVuY3Rpb24tJHtlbnZpcm9ubWVudH1gXG4gICAgLy8gfSk7XG5cbiAgICAvLyBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdPcmRlcmluZ0Z1bmN0aW9uTmFtZScsIHtcbiAgICAvLyAgIHZhbHVlOiB0aGlzLm1pY3Jvc2VydmljZXMub3JkZXJpbmdNaWNyb3NlcnZpY2UuZnVuY3Rpb25OYW1lLFxuICAgIC8vICAgZGVzY3JpcHRpb246ICdPcmRlcmluZyBMYW1iZGEgZnVuY3Rpb24gbmFtZScsXG4gICAgLy8gICBleHBvcnROYW1lOiBgJHtpZH0tT3JkZXJpbmdGdW5jdGlvbi0ke2Vudmlyb25tZW50fWBcbiAgICAvLyB9KTtcbiAgfVxufSJdfQ==