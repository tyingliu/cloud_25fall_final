"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwnApiGateway = void 0;
// /Users/tzuying/CS6620/final project/aws-microservices/lib/apigateway.ts
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
const constructs_1 = require("constructs");
class SwnApiGateway extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        // Product api gateway
        this.createProductApi(props.productMicroservice);
        // Basket api gateway
        this.createBasketApi(props.basketMicroservice);
        // Ordering api gateway
        this.createOrderApi(props.orderingMicroservices);
    }
    createProductApi(productMicroservice) {
        // Product microservices api gateway
        // root name = product
        // GET /product
        // POST /product
        // Single product with id parameter
        // GET /product/{id}
        // PUT /product/{id}
        // DELETE /product/{id}
        const apigw = new aws_apigateway_1.LambdaRestApi(this, 'productApi', {
            restApiName: 'Product Service',
            handler: productMicroservice,
            proxy: false
        });
        const product = apigw.root.addResource('product');
        product.addMethod('GET'); // GET /product
        product.addMethod('POST'); // POST /product
        const singleProduct = product.addResource('{id}'); // product/{id}
        singleProduct.addMethod('GET'); // GET /product/{id}
        singleProduct.addMethod('PUT'); // PUT /product/{id}
        singleProduct.addMethod('DELETE'); // DELETE /product/{id}
    }
    createBasketApi(basketMicroservice) {
        // Basket microservices api gateway
        // root name = basket
        // GET /basket
        // POST /basket
        // // Single basket with userName parameter - resource name = basket/{userName}
        // GET /basket/{userName}
        // DELETE /basket/{userName}
        // checkout basket async flow
        // POST /basket/checkout
        const apigw = new aws_apigateway_1.LambdaRestApi(this, 'basketApi', {
            restApiName: 'Basket Service',
            handler: basketMicroservice,
            proxy: false
        });
        const basket = apigw.root.addResource('basket');
        basket.addMethod('GET'); // GET /basket
        basket.addMethod('POST'); // POST /basket
        const singleBasket = basket.addResource('{userName}');
        singleBasket.addMethod('GET'); // GET /basket/{userName}
        singleBasket.addMethod('DELETE'); // DELETE /basket/{userName}
        const basketCheckout = basket.addResource('checkout');
        basketCheckout.addMethod('POST'); // POST /basket/checkout
        // expected request payload : { userName : swn }
    }
    createOrderApi(orderingMicroservices) {
        // Ordering microservices api gateway
        // root name = order
        // GET /order
        // GET /order/{userName}
        // expected request : xxx/order/swn?orderDate=timestamp
        // ordering ms grap input and query parameters and filter to dynamo db
        const apigw = new aws_apigateway_1.LambdaRestApi(this, 'orderApi', {
            restApiName: 'Order Service',
            handler: orderingMicroservices,
            proxy: false
        });
        const order = apigw.root.addResource('order');
        order.addMethod('GET'); // GET /order        
        const singleOrder = order.addResource('{userName}');
        singleOrder.addMethod('GET'); // GET /order/{userName}
        // expected request : xxx/order/swn?orderDate=timestamp
        // ordering ms grap input and query parameters and filter to dynamo db
        return singleOrder;
    }
}
exports.SwnApiGateway = SwnApiGateway;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpZ2F0ZXdheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwaWdhdGV3YXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMEVBQTBFO0FBQzFFLCtEQUEyRDtBQUUzRCwyQ0FBdUM7QUFRdkMsTUFBYSxhQUFjLFNBQVEsc0JBQVM7SUFFeEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF5QjtRQUMvRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLHNCQUFzQjtRQUN0QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDakQscUJBQXFCO1FBQ3JCLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDL0MsdUJBQXVCO1FBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVPLGdCQUFnQixDQUFDLG1CQUE4QjtRQUNuRCxvQ0FBb0M7UUFDcEMsc0JBQXNCO1FBRXRCLGVBQWU7UUFDZixnQkFBZ0I7UUFFaEIsbUNBQW1DO1FBQ25DLG9CQUFvQjtRQUNwQixvQkFBb0I7UUFDcEIsdUJBQXVCO1FBRXZCLE1BQU0sS0FBSyxHQUFHLElBQUksOEJBQWEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ2hELFdBQVcsRUFBRSxpQkFBaUI7WUFDOUIsT0FBTyxFQUFFLG1CQUFtQjtZQUM1QixLQUFLLEVBQUUsS0FBSztTQUNmLENBQUMsQ0FBQztRQUVILE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xELE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxlQUFlO1FBQ3pDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBRSxnQkFBZ0I7UUFFNUMsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGVBQWU7UUFDbEUsYUFBYSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLG9CQUFvQjtRQUNwRCxhQUFhLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsb0JBQW9CO1FBQ3BELGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx1QkFBdUI7SUFDOUQsQ0FBQztJQUVPLGVBQWUsQ0FBQyxrQkFBNkI7UUFDakQsbUNBQW1DO1FBQ25DLHFCQUFxQjtRQUVyQixjQUFjO1FBQ2QsZUFBZTtRQUVmLCtFQUErRTtRQUMvRSx5QkFBeUI7UUFDekIsNEJBQTRCO1FBRTVCLDZCQUE2QjtRQUM3Qix3QkFBd0I7UUFFeEIsTUFBTSxLQUFLLEdBQUcsSUFBSSw4QkFBYSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDL0MsV0FBVyxFQUFFLGdCQUFnQjtZQUM3QixPQUFPLEVBQUUsa0JBQWtCO1lBQzNCLEtBQUssRUFBRSxLQUFLO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFFLGNBQWM7UUFDeEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFFLGVBQWU7UUFFMUMsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN0RCxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUUseUJBQXlCO1FBQ3pELFlBQVksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyw0QkFBNEI7UUFFOUQsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0RCxjQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsd0JBQXdCO1FBQzFELGdEQUFnRDtJQUNwRCxDQUFDO0lBRU8sY0FBYyxDQUFDLHFCQUFnQztRQUNuRCxxQ0FBcUM7UUFDckMsb0JBQW9CO1FBRXBCLGFBQWE7UUFDYix3QkFBd0I7UUFDeEIsdURBQXVEO1FBQ3ZELHNFQUFzRTtRQUV0RSxNQUFNLEtBQUssR0FBRyxJQUFJLDhCQUFhLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM5QyxXQUFXLEVBQUUsZUFBZTtZQUM1QixPQUFPLEVBQUUscUJBQXFCO1lBQzlCLEtBQUssRUFBRSxLQUFLO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFFLHFCQUFxQjtRQUU5QyxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3BELFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBRSx3QkFBd0I7UUFDdkQsdURBQXVEO1FBQ3ZELHNFQUFzRTtRQUV0RSxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0NBQ0o7QUFuR0Qsc0NBbUdDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gL1VzZXJzL3R6dXlpbmcvQ1M2NjIwL2ZpbmFsIHByb2plY3QvYXdzLW1pY3Jvc2VydmljZXMvbGliL2FwaWdhdGV3YXkudHNcbmltcG9ydCB7IExhbWJkYVJlc3RBcGkgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXlcIjtcbmltcG9ydCB7IElGdW5jdGlvbiB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtbGFtYmRhXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuXG5pbnRlcmZhY2UgU3duQXBpR2F0ZXdheVByb3BzIHtcbiAgICBwcm9kdWN0TWljcm9zZXJ2aWNlOiBJRnVuY3Rpb24sXG4gICAgYmFza2V0TWljcm9zZXJ2aWNlOiBJRnVuY3Rpb24sXG4gICAgb3JkZXJpbmdNaWNyb3NlcnZpY2VzOiBJRnVuY3Rpb25cbn1cblxuZXhwb3J0IGNsYXNzIFN3bkFwaUdhdGV3YXkgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFN3bkFwaUdhdGV3YXlQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgICAgIC8vIFByb2R1Y3QgYXBpIGdhdGV3YXlcbiAgICAgICAgdGhpcy5jcmVhdGVQcm9kdWN0QXBpKHByb3BzLnByb2R1Y3RNaWNyb3NlcnZpY2UpO1xuICAgICAgICAvLyBCYXNrZXQgYXBpIGdhdGV3YXlcbiAgICAgICAgdGhpcy5jcmVhdGVCYXNrZXRBcGkocHJvcHMuYmFza2V0TWljcm9zZXJ2aWNlKTtcbiAgICAgICAgLy8gT3JkZXJpbmcgYXBpIGdhdGV3YXlcbiAgICAgICAgdGhpcy5jcmVhdGVPcmRlckFwaShwcm9wcy5vcmRlcmluZ01pY3Jvc2VydmljZXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlUHJvZHVjdEFwaShwcm9kdWN0TWljcm9zZXJ2aWNlOiBJRnVuY3Rpb24pIHtcbiAgICAgICAgLy8gUHJvZHVjdCBtaWNyb3NlcnZpY2VzIGFwaSBnYXRld2F5XG4gICAgICAgIC8vIHJvb3QgbmFtZSA9IHByb2R1Y3RcblxuICAgICAgICAvLyBHRVQgL3Byb2R1Y3RcbiAgICAgICAgLy8gUE9TVCAvcHJvZHVjdFxuXG4gICAgICAgIC8vIFNpbmdsZSBwcm9kdWN0IHdpdGggaWQgcGFyYW1ldGVyXG4gICAgICAgIC8vIEdFVCAvcHJvZHVjdC97aWR9XG4gICAgICAgIC8vIFBVVCAvcHJvZHVjdC97aWR9XG4gICAgICAgIC8vIERFTEVURSAvcHJvZHVjdC97aWR9XG5cbiAgICAgICAgY29uc3QgYXBpZ3cgPSBuZXcgTGFtYmRhUmVzdEFwaSh0aGlzLCAncHJvZHVjdEFwaScsIHtcbiAgICAgICAgICAgIHJlc3RBcGlOYW1lOiAnUHJvZHVjdCBTZXJ2aWNlJyxcbiAgICAgICAgICAgIGhhbmRsZXI6IHByb2R1Y3RNaWNyb3NlcnZpY2UsXG4gICAgICAgICAgICBwcm94eTogZmFsc2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcHJvZHVjdCA9IGFwaWd3LnJvb3QuYWRkUmVzb3VyY2UoJ3Byb2R1Y3QnKTtcbiAgICAgICAgcHJvZHVjdC5hZGRNZXRob2QoJ0dFVCcpOyAvLyBHRVQgL3Byb2R1Y3RcbiAgICAgICAgcHJvZHVjdC5hZGRNZXRob2QoJ1BPU1QnKTsgIC8vIFBPU1QgL3Byb2R1Y3RcblxuICAgICAgICBjb25zdCBzaW5nbGVQcm9kdWN0ID0gcHJvZHVjdC5hZGRSZXNvdXJjZSgne2lkfScpOyAvLyBwcm9kdWN0L3tpZH1cbiAgICAgICAgc2luZ2xlUHJvZHVjdC5hZGRNZXRob2QoJ0dFVCcpOyAvLyBHRVQgL3Byb2R1Y3Qve2lkfVxuICAgICAgICBzaW5nbGVQcm9kdWN0LmFkZE1ldGhvZCgnUFVUJyk7IC8vIFBVVCAvcHJvZHVjdC97aWR9XG4gICAgICAgIHNpbmdsZVByb2R1Y3QuYWRkTWV0aG9kKCdERUxFVEUnKTsgLy8gREVMRVRFIC9wcm9kdWN0L3tpZH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUJhc2tldEFwaShiYXNrZXRNaWNyb3NlcnZpY2U6IElGdW5jdGlvbikge1xuICAgICAgICAvLyBCYXNrZXQgbWljcm9zZXJ2aWNlcyBhcGkgZ2F0ZXdheVxuICAgICAgICAvLyByb290IG5hbWUgPSBiYXNrZXRcblxuICAgICAgICAvLyBHRVQgL2Jhc2tldFxuICAgICAgICAvLyBQT1NUIC9iYXNrZXRcblxuICAgICAgICAvLyAvLyBTaW5nbGUgYmFza2V0IHdpdGggdXNlck5hbWUgcGFyYW1ldGVyIC0gcmVzb3VyY2UgbmFtZSA9IGJhc2tldC97dXNlck5hbWV9XG4gICAgICAgIC8vIEdFVCAvYmFza2V0L3t1c2VyTmFtZX1cbiAgICAgICAgLy8gREVMRVRFIC9iYXNrZXQve3VzZXJOYW1lfVxuXG4gICAgICAgIC8vIGNoZWNrb3V0IGJhc2tldCBhc3luYyBmbG93XG4gICAgICAgIC8vIFBPU1QgL2Jhc2tldC9jaGVja291dFxuXG4gICAgICAgIGNvbnN0IGFwaWd3ID0gbmV3IExhbWJkYVJlc3RBcGkodGhpcywgJ2Jhc2tldEFwaScsIHtcbiAgICAgICAgICAgIHJlc3RBcGlOYW1lOiAnQmFza2V0IFNlcnZpY2UnLFxuICAgICAgICAgICAgaGFuZGxlcjogYmFza2V0TWljcm9zZXJ2aWNlLFxuICAgICAgICAgICAgcHJveHk6IGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGJhc2tldCA9IGFwaWd3LnJvb3QuYWRkUmVzb3VyY2UoJ2Jhc2tldCcpO1xuICAgICAgICBiYXNrZXQuYWRkTWV0aG9kKCdHRVQnKTsgIC8vIEdFVCAvYmFza2V0XG4gICAgICAgIGJhc2tldC5hZGRNZXRob2QoJ1BPU1QnKTsgIC8vIFBPU1QgL2Jhc2tldFxuXG4gICAgICAgIGNvbnN0IHNpbmdsZUJhc2tldCA9IGJhc2tldC5hZGRSZXNvdXJjZSgne3VzZXJOYW1lfScpO1xuICAgICAgICBzaW5nbGVCYXNrZXQuYWRkTWV0aG9kKCdHRVQnKTsgIC8vIEdFVCAvYmFza2V0L3t1c2VyTmFtZX1cbiAgICAgICAgc2luZ2xlQmFza2V0LmFkZE1ldGhvZCgnREVMRVRFJyk7IC8vIERFTEVURSAvYmFza2V0L3t1c2VyTmFtZX1cblxuICAgICAgICBjb25zdCBiYXNrZXRDaGVja291dCA9IGJhc2tldC5hZGRSZXNvdXJjZSgnY2hlY2tvdXQnKTtcbiAgICAgICAgYmFza2V0Q2hlY2tvdXQuYWRkTWV0aG9kKCdQT1NUJyk7IC8vIFBPU1QgL2Jhc2tldC9jaGVja291dFxuICAgICAgICAvLyBleHBlY3RlZCByZXF1ZXN0IHBheWxvYWQgOiB7IHVzZXJOYW1lIDogc3duIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZU9yZGVyQXBpKG9yZGVyaW5nTWljcm9zZXJ2aWNlczogSUZ1bmN0aW9uKSB7XG4gICAgICAgIC8vIE9yZGVyaW5nIG1pY3Jvc2VydmljZXMgYXBpIGdhdGV3YXlcbiAgICAgICAgLy8gcm9vdCBuYW1lID0gb3JkZXJcblxuICAgICAgICAvLyBHRVQgL29yZGVyXG4gICAgICAgIC8vIEdFVCAvb3JkZXIve3VzZXJOYW1lfVxuICAgICAgICAvLyBleHBlY3RlZCByZXF1ZXN0IDogeHh4L29yZGVyL3N3bj9vcmRlckRhdGU9dGltZXN0YW1wXG4gICAgICAgIC8vIG9yZGVyaW5nIG1zIGdyYXAgaW5wdXQgYW5kIHF1ZXJ5IHBhcmFtZXRlcnMgYW5kIGZpbHRlciB0byBkeW5hbW8gZGJcblxuICAgICAgICBjb25zdCBhcGlndyA9IG5ldyBMYW1iZGFSZXN0QXBpKHRoaXMsICdvcmRlckFwaScsIHtcbiAgICAgICAgICAgIHJlc3RBcGlOYW1lOiAnT3JkZXIgU2VydmljZScsXG4gICAgICAgICAgICBoYW5kbGVyOiBvcmRlcmluZ01pY3Jvc2VydmljZXMsXG4gICAgICAgICAgICBwcm94eTogZmFsc2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgb3JkZXIgPSBhcGlndy5yb290LmFkZFJlc291cmNlKCdvcmRlcicpO1xuICAgICAgICBvcmRlci5hZGRNZXRob2QoJ0dFVCcpOyAgLy8gR0VUIC9vcmRlciAgICAgICAgXG5cbiAgICAgICAgY29uc3Qgc2luZ2xlT3JkZXIgPSBvcmRlci5hZGRSZXNvdXJjZSgne3VzZXJOYW1lfScpO1xuICAgICAgICBzaW5nbGVPcmRlci5hZGRNZXRob2QoJ0dFVCcpOyAgLy8gR0VUIC9vcmRlci97dXNlck5hbWV9XG4gICAgICAgIC8vIGV4cGVjdGVkIHJlcXVlc3QgOiB4eHgvb3JkZXIvc3duP29yZGVyRGF0ZT10aW1lc3RhbXBcbiAgICAgICAgLy8gb3JkZXJpbmcgbXMgZ3JhcCBpbnB1dCBhbmQgcXVlcnkgcGFyYW1ldGVycyBhbmQgZmlsdGVyIHRvIGR5bmFtbyBkYlxuXG4gICAgICAgIHJldHVybiBzaW5nbGVPcmRlcjtcbiAgICB9XG59Il19