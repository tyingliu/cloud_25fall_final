"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwnMicroservices = void 0;
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_lambda_nodejs_1 = require("aws-cdk-lib/aws-lambda-nodejs");
const constructs_1 = require("constructs");
const path_1 = require("path");
class SwnMicroservices extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        // product microservices
        this.productMicroservice = this.createProductFunction(props.productTable);
        // basket microservices
        this.basketMicroservice = this.createBasketFunction(props.basketTable);
        // ordering Microservice
        this.orderingMicroservice = this.createOrderingFunction(props.orderTable);
    }
    createProductFunction(productTable) {
        const nodeJsFunctionProps = {
            bundling: {
                externalModules: [
                    '@aws-sdk/*' // ✅ Changed from 'aws-sdk' to '@aws-sdk/*'
                ]
            },
            environment: {
                PRIMARY_KEY: 'id',
                DYNAMODB_TABLE_NAME: productTable.tableName
            },
            runtime: aws_lambda_1.Runtime.NODEJS_20_X
        };
        // Product microservices lambda function
        const productFunction = new aws_lambda_nodejs_1.NodejsFunction(this, 'productLambdaFunction', {
            entry: (0, path_1.join)(__dirname, `/../src/product/index.js`),
            ...nodeJsFunctionProps,
        });
        productTable.grantReadWriteData(productFunction);
        return productFunction;
    }
    createBasketFunction(basketTable) {
        const basketFunctionProps = {
            bundling: {
                externalModules: [
                    '@aws-sdk/*' // ✅ Changed from 'aws-sdk' to '@aws-sdk/*'
                ]
            },
            environment: {
                PRIMARY_KEY: 'userName',
                DYNAMODB_TABLE_NAME: basketTable.tableName,
                EVENT_SOURCE: "com.swn.basket.checkoutbasket",
                EVENT_DETAILTYPE: "CheckoutBasket",
                EVENT_BUSNAME: "SwnEventBus"
            },
            runtime: aws_lambda_1.Runtime.NODEJS_20_X
        };
        const basketFunction = new aws_lambda_nodejs_1.NodejsFunction(this, 'basketLambdaFunction', {
            entry: (0, path_1.join)(__dirname, `/../src/basket/index.js`),
            ...basketFunctionProps,
        });
        basketTable.grantReadWriteData(basketFunction);
        return basketFunction;
    }
    createOrderingFunction(orderTable) {
        const nodeJsFunctionProps = {
            bundling: {
                externalModules: [
                    '@aws-sdk/*' // ✅ Changed from 'aws-sdk' to '@aws-sdk/*'
                ]
            },
            environment: {
                PRIMARY_KEY: 'userName',
                SORT_KEY: 'orderDate',
                DYNAMODB_TABLE_NAME: orderTable.tableName,
            },
            runtime: aws_lambda_1.Runtime.NODEJS_20_X
        };
        const orderFunction = new aws_lambda_nodejs_1.NodejsFunction(this, 'orderingLambdaFunction', {
            entry: (0, path_1.join)(__dirname, `/../src/ordering/index.js`),
            ...nodeJsFunctionProps,
        });
        orderTable.grantReadWriteData(orderFunction);
        return orderFunction;
    }
}
exports.SwnMicroservices = SwnMicroservices;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWljcm9zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWljcm9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHVEQUFpRDtBQUNqRCxxRUFBb0Y7QUFDcEYsMkNBQXVDO0FBQ3ZDLCtCQUE0QjtBQVE1QixNQUFhLGdCQUFpQixTQUFRLHNCQUFTO0lBTTdDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBNEI7UUFDcEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQix3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDMUUsdUJBQXVCO1FBQ3ZCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZFLHdCQUF3QjtRQUN4QixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRU8scUJBQXFCLENBQUMsWUFBb0I7UUFDaEQsTUFBTSxtQkFBbUIsR0FBd0I7WUFDL0MsUUFBUSxFQUFFO2dCQUNSLGVBQWUsRUFBRTtvQkFDZixZQUFZLENBQUMsMkNBQTJDO2lCQUN6RDthQUNGO1lBQ0QsV0FBVyxFQUFFO2dCQUNYLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixtQkFBbUIsRUFBRSxZQUFZLENBQUMsU0FBUzthQUM1QztZQUNELE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7U0FDN0IsQ0FBQTtRQUVELHdDQUF3QztRQUN4QyxNQUFNLGVBQWUsR0FBRyxJQUFJLGtDQUFjLENBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFO1lBQ3hFLEtBQUssRUFBRSxJQUFBLFdBQUksRUFBQyxTQUFTLEVBQUUsMEJBQTBCLENBQUM7WUFDbEQsR0FBRyxtQkFBbUI7U0FDdkIsQ0FBQyxDQUFDO1FBRUgsWUFBWSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRWpELE9BQU8sZUFBZSxDQUFDO0lBQ3pCLENBQUM7SUFFTyxvQkFBb0IsQ0FBQyxXQUFtQjtRQUM5QyxNQUFNLG1CQUFtQixHQUF3QjtZQUMvQyxRQUFRLEVBQUU7Z0JBQ1IsZUFBZSxFQUFFO29CQUNmLFlBQVksQ0FBQywyQ0FBMkM7aUJBQ3pEO2FBQ0Y7WUFDRCxXQUFXLEVBQUU7Z0JBQ1gsV0FBVyxFQUFFLFVBQVU7Z0JBQ3ZCLG1CQUFtQixFQUFFLFdBQVcsQ0FBQyxTQUFTO2dCQUMxQyxZQUFZLEVBQUUsK0JBQStCO2dCQUM3QyxnQkFBZ0IsRUFBRSxnQkFBZ0I7Z0JBQ2xDLGFBQWEsRUFBRSxhQUFhO2FBQzdCO1lBQ0QsT0FBTyxFQUFFLG9CQUFPLENBQUMsV0FBVztTQUM3QixDQUFBO1FBRUQsTUFBTSxjQUFjLEdBQUcsSUFBSSxrQ0FBYyxDQUFDLElBQUksRUFBRSxzQkFBc0IsRUFBRTtZQUN0RSxLQUFLLEVBQUUsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLHlCQUF5QixDQUFDO1lBQ2pELEdBQUcsbUJBQW1CO1NBQ3ZCLENBQUMsQ0FBQztRQUVILFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMvQyxPQUFPLGNBQWMsQ0FBQztJQUN4QixDQUFDO0lBRU8sc0JBQXNCLENBQUMsVUFBa0I7UUFDL0MsTUFBTSxtQkFBbUIsR0FBd0I7WUFDL0MsUUFBUSxFQUFFO2dCQUNSLGVBQWUsRUFBRTtvQkFDZixZQUFZLENBQUMsMkNBQTJDO2lCQUN6RDthQUNGO1lBQ0QsV0FBVyxFQUFFO2dCQUNYLFdBQVcsRUFBRSxVQUFVO2dCQUN2QixRQUFRLEVBQUUsV0FBVztnQkFDckIsbUJBQW1CLEVBQUUsVUFBVSxDQUFDLFNBQVM7YUFDMUM7WUFDRCxPQUFPLEVBQUUsb0JBQU8sQ0FBQyxXQUFXO1NBQzdCLENBQUE7UUFFRCxNQUFNLGFBQWEsR0FBRyxJQUFJLGtDQUFjLENBQUMsSUFBSSxFQUFFLHdCQUF3QixFQUFFO1lBQ3ZFLEtBQUssRUFBRSxJQUFBLFdBQUksRUFBQyxTQUFTLEVBQUUsMkJBQTJCLENBQUM7WUFDbkQsR0FBRyxtQkFBbUI7U0FDdkIsQ0FBQyxDQUFDO1FBRUgsVUFBVSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzdDLE9BQU8sYUFBYSxDQUFDO0lBQ3ZCLENBQUM7Q0FFRjtBQTVGRCw0Q0E0RkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAvVXNlcnMvdHp1eWluZy9DUzY2MjAvZmluYWwgcHJvamVjdC9hd3MtbWljcm9zZXJ2aWNlcy9saWIvbWljcm9zZXJ2aWNlLnRzXG5pbXBvcnQgeyBJVGFibGUgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiXCI7XG5pbXBvcnQgeyBSdW50aW1lIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGFcIjtcbmltcG9ydCB7IE5vZGVqc0Z1bmN0aW9uLCBOb2RlanNGdW5jdGlvblByb3BzIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGEtbm9kZWpzXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gXCJwYXRoXCI7XG5cbmludGVyZmFjZSBTd25NaWNyb3NlcnZpY2VzUHJvcHMge1xuICBwcm9kdWN0VGFibGU6IElUYWJsZTtcbiAgYmFza2V0VGFibGU6IElUYWJsZTtcbiAgb3JkZXJUYWJsZTogSVRhYmxlO1xufVxuXG5leHBvcnQgY2xhc3MgU3duTWljcm9zZXJ2aWNlcyBleHRlbmRzIENvbnN0cnVjdCB7XG5cbiAgcHVibGljIHJlYWRvbmx5IHByb2R1Y3RNaWNyb3NlcnZpY2U6IE5vZGVqc0Z1bmN0aW9uO1xuICBwdWJsaWMgcmVhZG9ubHkgYmFza2V0TWljcm9zZXJ2aWNlOiBOb2RlanNGdW5jdGlvbjtcbiAgcHVibGljIHJlYWRvbmx5IG9yZGVyaW5nTWljcm9zZXJ2aWNlOiBOb2RlanNGdW5jdGlvbjtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogU3duTWljcm9zZXJ2aWNlc1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIC8vIHByb2R1Y3QgbWljcm9zZXJ2aWNlc1xuICAgIHRoaXMucHJvZHVjdE1pY3Jvc2VydmljZSA9IHRoaXMuY3JlYXRlUHJvZHVjdEZ1bmN0aW9uKHByb3BzLnByb2R1Y3RUYWJsZSk7XG4gICAgLy8gYmFza2V0IG1pY3Jvc2VydmljZXNcbiAgICB0aGlzLmJhc2tldE1pY3Jvc2VydmljZSA9IHRoaXMuY3JlYXRlQmFza2V0RnVuY3Rpb24ocHJvcHMuYmFza2V0VGFibGUpO1xuICAgIC8vIG9yZGVyaW5nIE1pY3Jvc2VydmljZVxuICAgIHRoaXMub3JkZXJpbmdNaWNyb3NlcnZpY2UgPSB0aGlzLmNyZWF0ZU9yZGVyaW5nRnVuY3Rpb24ocHJvcHMub3JkZXJUYWJsZSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVByb2R1Y3RGdW5jdGlvbihwcm9kdWN0VGFibGU6IElUYWJsZSk6IE5vZGVqc0Z1bmN0aW9uIHtcbiAgICBjb25zdCBub2RlSnNGdW5jdGlvblByb3BzOiBOb2RlanNGdW5jdGlvblByb3BzID0ge1xuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgZXh0ZXJuYWxNb2R1bGVzOiBbXG4gICAgICAgICAgJ0Bhd3Mtc2RrLyonIC8vIOKchSBDaGFuZ2VkIGZyb20gJ2F3cy1zZGsnIHRvICdAYXdzLXNkay8qJ1xuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgUFJJTUFSWV9LRVk6ICdpZCcsXG4gICAgICAgIERZTkFNT0RCX1RBQkxFX05BTUU6IHByb2R1Y3RUYWJsZS50YWJsZU5hbWVcbiAgICAgIH0sXG4gICAgICBydW50aW1lOiBSdW50aW1lLk5PREVKU18yMF9YXG4gICAgfVxuXG4gICAgLy8gUHJvZHVjdCBtaWNyb3NlcnZpY2VzIGxhbWJkYSBmdW5jdGlvblxuICAgIGNvbnN0IHByb2R1Y3RGdW5jdGlvbiA9IG5ldyBOb2RlanNGdW5jdGlvbih0aGlzLCAncHJvZHVjdExhbWJkYUZ1bmN0aW9uJywge1xuICAgICAgZW50cnk6IGpvaW4oX19kaXJuYW1lLCBgLy4uL3NyYy9wcm9kdWN0L2luZGV4LmpzYCksXG4gICAgICAuLi5ub2RlSnNGdW5jdGlvblByb3BzLFxuICAgIH0pO1xuXG4gICAgcHJvZHVjdFRhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShwcm9kdWN0RnVuY3Rpb24pO1xuXG4gICAgcmV0dXJuIHByb2R1Y3RGdW5jdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQmFza2V0RnVuY3Rpb24oYmFza2V0VGFibGU6IElUYWJsZSk6IE5vZGVqc0Z1bmN0aW9uIHtcbiAgICBjb25zdCBiYXNrZXRGdW5jdGlvblByb3BzOiBOb2RlanNGdW5jdGlvblByb3BzID0ge1xuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgZXh0ZXJuYWxNb2R1bGVzOiBbXG4gICAgICAgICAgJ0Bhd3Mtc2RrLyonIC8vIOKchSBDaGFuZ2VkIGZyb20gJ2F3cy1zZGsnIHRvICdAYXdzLXNkay8qJ1xuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgUFJJTUFSWV9LRVk6ICd1c2VyTmFtZScsXG4gICAgICAgIERZTkFNT0RCX1RBQkxFX05BTUU6IGJhc2tldFRhYmxlLnRhYmxlTmFtZSxcbiAgICAgICAgRVZFTlRfU09VUkNFOiBcImNvbS5zd24uYmFza2V0LmNoZWNrb3V0YmFza2V0XCIsXG4gICAgICAgIEVWRU5UX0RFVEFJTFRZUEU6IFwiQ2hlY2tvdXRCYXNrZXRcIixcbiAgICAgICAgRVZFTlRfQlVTTkFNRTogXCJTd25FdmVudEJ1c1wiXG4gICAgICB9LFxuICAgICAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMjBfWFxuICAgIH1cblxuICAgIGNvbnN0IGJhc2tldEZ1bmN0aW9uID0gbmV3IE5vZGVqc0Z1bmN0aW9uKHRoaXMsICdiYXNrZXRMYW1iZGFGdW5jdGlvbicsIHtcbiAgICAgIGVudHJ5OiBqb2luKF9fZGlybmFtZSwgYC8uLi9zcmMvYmFza2V0L2luZGV4LmpzYCksXG4gICAgICAuLi5iYXNrZXRGdW5jdGlvblByb3BzLFxuICAgIH0pO1xuXG4gICAgYmFza2V0VGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGJhc2tldEZ1bmN0aW9uKTtcbiAgICByZXR1cm4gYmFza2V0RnVuY3Rpb247XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZU9yZGVyaW5nRnVuY3Rpb24ob3JkZXJUYWJsZTogSVRhYmxlKTogTm9kZWpzRnVuY3Rpb24ge1xuICAgIGNvbnN0IG5vZGVKc0Z1bmN0aW9uUHJvcHM6IE5vZGVqc0Z1bmN0aW9uUHJvcHMgPSB7XG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBleHRlcm5hbE1vZHVsZXM6IFtcbiAgICAgICAgICAnQGF3cy1zZGsvKicgLy8g4pyFIENoYW5nZWQgZnJvbSAnYXdzLXNkaycgdG8gJ0Bhd3Mtc2RrLyonXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBQUklNQVJZX0tFWTogJ3VzZXJOYW1lJyxcbiAgICAgICAgU09SVF9LRVk6ICdvcmRlckRhdGUnLFxuICAgICAgICBEWU5BTU9EQl9UQUJMRV9OQU1FOiBvcmRlclRhYmxlLnRhYmxlTmFtZSxcbiAgICAgIH0sXG4gICAgICBydW50aW1lOiBSdW50aW1lLk5PREVKU18yMF9YXG4gICAgfVxuXG4gICAgY29uc3Qgb3JkZXJGdW5jdGlvbiA9IG5ldyBOb2RlanNGdW5jdGlvbih0aGlzLCAnb3JkZXJpbmdMYW1iZGFGdW5jdGlvbicsIHtcbiAgICAgIGVudHJ5OiBqb2luKF9fZGlybmFtZSwgYC8uLi9zcmMvb3JkZXJpbmcvaW5kZXguanNgKSxcbiAgICAgIC4uLm5vZGVKc0Z1bmN0aW9uUHJvcHMsXG4gICAgfSk7XG5cbiAgICBvcmRlclRhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShvcmRlckZ1bmN0aW9uKTtcbiAgICByZXR1cm4gb3JkZXJGdW5jdGlvbjtcbiAgfVxuXG59Il19