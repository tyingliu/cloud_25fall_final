"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsMicroservicesStack = void 0;
// /Users/tzuying/CS6620/final project/aws-microservices/lib/aws-microservices-stack.ts
const aws_cdk_lib_1 = require("aws-cdk-lib");
const apigateway_1 = require("./apigateway");
const database_1 = require("./database");
const eventbus_1 = require("./eventbus");
const microservice_1 = require("./microservice");
const queue_1 = require("./queue");
class AwsMicroservicesStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const database = new database_1.SwnDatabase(this, 'Database');
        const microservices = new microservice_1.SwnMicroservices(this, 'Microservices', {
            productTable: database.productTable,
            basketTable: database.basketTable,
            orderTable: database.orderTable
        });
        const apigateway = new apigateway_1.SwnApiGateway(this, 'ApiGateway', {
            productMicroservice: microservices.productMicroservice,
            basketMicroservice: microservices.basketMicroservice,
            orderingMicroservices: microservices.orderingMicroservice
        });
        const queue = new queue_1.SwnQueue(this, 'Queue', {
            consumer: microservices.orderingMicroservice
        });
        const eventbus = new eventbus_1.SwnEventBus(this, 'EventBus', {
            publisherFuntion: microservices.basketMicroservice,
            targetQueue: queue.orderQueue
        });
    }
}
exports.AwsMicroservicesStack = AwsMicroservicesStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLW1pY3Jvc2VydmljZXMtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhd3MtbWljcm9zZXJ2aWNlcy1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1RkFBdUY7QUFDdkYsNkNBQWdEO0FBRWhELDZDQUE2QztBQUM3Qyx5Q0FBeUM7QUFDekMseUNBQXlDO0FBQ3pDLGlEQUFrRDtBQUNsRCxtQ0FBbUM7QUFFbkMsTUFBYSxxQkFBc0IsU0FBUSxtQkFBSztJQUM5QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sUUFBUSxHQUFHLElBQUksc0JBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFbkQsTUFBTSxhQUFhLEdBQUcsSUFBSSwrQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ2hFLFlBQVksRUFBRSxRQUFRLENBQUMsWUFBWTtZQUNuQyxXQUFXLEVBQUUsUUFBUSxDQUFDLFdBQVc7WUFDakMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxVQUFVO1NBQ2hDLENBQUMsQ0FBQztRQUVILE1BQU0sVUFBVSxHQUFHLElBQUksMEJBQWEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ3ZELG1CQUFtQixFQUFFLGFBQWEsQ0FBQyxtQkFBbUI7WUFDdEQsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLGtCQUFrQjtZQUNwRCxxQkFBcUIsRUFBRSxhQUFhLENBQUMsb0JBQW9CO1NBQzFELENBQUMsQ0FBQztRQUVILE1BQU0sS0FBSyxHQUFHLElBQUksZ0JBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ3hDLFFBQVEsRUFBRSxhQUFhLENBQUMsb0JBQW9CO1NBQzdDLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLElBQUksc0JBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ2pELGdCQUFnQixFQUFFLGFBQWEsQ0FBQyxrQkFBa0I7WUFDbEQsV0FBVyxFQUFFLEtBQUssQ0FBQyxVQUFVO1NBQzlCLENBQUMsQ0FBQztJQUVMLENBQUM7Q0FDRjtBQTVCRCxzREE0QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAvVXNlcnMvdHp1eWluZy9DUzY2MjAvZmluYWwgcHJvamVjdC9hd3MtbWljcm9zZXJ2aWNlcy9saWIvYXdzLW1pY3Jvc2VydmljZXMtc3RhY2sudHNcbmltcG9ydCB7IFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBTd25BcGlHYXRld2F5IH0gZnJvbSAnLi9hcGlnYXRld2F5JztcbmltcG9ydCB7IFN3bkRhdGFiYXNlIH0gZnJvbSAnLi9kYXRhYmFzZSc7XG5pbXBvcnQgeyBTd25FdmVudEJ1cyB9IGZyb20gJy4vZXZlbnRidXMnO1xuaW1wb3J0IHsgU3duTWljcm9zZXJ2aWNlcyB9IGZyb20gJy4vbWljcm9zZXJ2aWNlJztcbmltcG9ydCB7IFN3blF1ZXVlIH0gZnJvbSAnLi9xdWV1ZSc7XG5cbmV4cG9ydCBjbGFzcyBBd3NNaWNyb3NlcnZpY2VzU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgZGF0YWJhc2UgPSBuZXcgU3duRGF0YWJhc2UodGhpcywgJ0RhdGFiYXNlJyk7XG5cbiAgICBjb25zdCBtaWNyb3NlcnZpY2VzID0gbmV3IFN3bk1pY3Jvc2VydmljZXModGhpcywgJ01pY3Jvc2VydmljZXMnLCB7XG4gICAgICBwcm9kdWN0VGFibGU6IGRhdGFiYXNlLnByb2R1Y3RUYWJsZSxcbiAgICAgIGJhc2tldFRhYmxlOiBkYXRhYmFzZS5iYXNrZXRUYWJsZSxcbiAgICAgIG9yZGVyVGFibGU6IGRhdGFiYXNlLm9yZGVyVGFibGVcbiAgICB9KTtcblxuICAgIGNvbnN0IGFwaWdhdGV3YXkgPSBuZXcgU3duQXBpR2F0ZXdheSh0aGlzLCAnQXBpR2F0ZXdheScsIHtcbiAgICAgIHByb2R1Y3RNaWNyb3NlcnZpY2U6IG1pY3Jvc2VydmljZXMucHJvZHVjdE1pY3Jvc2VydmljZSxcbiAgICAgIGJhc2tldE1pY3Jvc2VydmljZTogbWljcm9zZXJ2aWNlcy5iYXNrZXRNaWNyb3NlcnZpY2UsXG4gICAgICBvcmRlcmluZ01pY3Jvc2VydmljZXM6IG1pY3Jvc2VydmljZXMub3JkZXJpbmdNaWNyb3NlcnZpY2VcbiAgICB9KTtcblxuICAgIGNvbnN0IHF1ZXVlID0gbmV3IFN3blF1ZXVlKHRoaXMsICdRdWV1ZScsIHtcbiAgICAgIGNvbnN1bWVyOiBtaWNyb3NlcnZpY2VzLm9yZGVyaW5nTWljcm9zZXJ2aWNlXG4gICAgfSk7XG5cbiAgICBjb25zdCBldmVudGJ1cyA9IG5ldyBTd25FdmVudEJ1cyh0aGlzLCAnRXZlbnRCdXMnLCB7XG4gICAgICBwdWJsaXNoZXJGdW50aW9uOiBtaWNyb3NlcnZpY2VzLmJhc2tldE1pY3Jvc2VydmljZSxcbiAgICAgIHRhcmdldFF1ZXVlOiBxdWV1ZS5vcmRlclF1ZXVlXG4gICAgfSk7XG5cbiAgfVxufVxuIl19