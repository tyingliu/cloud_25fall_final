"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwnMicroservices = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_lambda_nodejs_1 = require("aws-cdk-lib/aws-lambda-nodejs");
const aws_logs_1 = require("aws-cdk-lib/aws-logs");
const constructs_1 = require("constructs");
const path_1 = require("path");
class SwnMicroservices extends constructs_1.Construct {
    constructor(scope, id, props) {
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
        this.inventoryMicroservice = this.createInventoryFunction(props.productTable, isProd);
    }
    createProductFunction(productTable, isProd) {
        const nodeJsFunctionProps = {
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
            runtime: aws_lambda_1.Runtime.NODEJS_20_X,
            timeout: aws_cdk_lib_1.Duration.seconds(30),
            memorySize: isProd ? 512 : 256,
            tracing: aws_lambda_1.Tracing.ACTIVE,
            logRetention: isProd ? aws_logs_1.RetentionDays.ONE_MONTH : aws_logs_1.RetentionDays.ONE_WEEK,
            description: 'Product microservice Lambda function',
        };
        // Product microservices lambda function
        const productFunction = new aws_lambda_nodejs_1.NodejsFunction(this, 'productLambdaFunction', {
            entry: (0, path_1.join)(__dirname, `/../src/product/index.js`),
            ...nodeJsFunctionProps,
            functionName: 'ProductMicroservice',
        });
        productTable.grantReadWriteData(productFunction);
        return productFunction;
    }
    createBasketFunction(basketTable, isProd) {
        const basketFunctionProps = {
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
            runtime: aws_lambda_1.Runtime.NODEJS_20_X,
            timeout: aws_cdk_lib_1.Duration.seconds(30),
            memorySize: isProd ? 512 : 256,
            tracing: aws_lambda_1.Tracing.ACTIVE,
            logRetention: isProd ? aws_logs_1.RetentionDays.ONE_MONTH : aws_logs_1.RetentionDays.ONE_WEEK,
            description: 'Basket microservice Lambda function with EventBridge integration',
        };
        const basketFunction = new aws_lambda_nodejs_1.NodejsFunction(this, 'basketLambdaFunction', {
            entry: (0, path_1.join)(__dirname, `/../src/basket/index.js`),
            ...basketFunctionProps,
            functionName: 'BasketMicroservice',
        });
        basketTable.grantReadWriteData(basketFunction);
        return basketFunction;
    }
    createOrderingFunction(orderTable, isProd) {
        const nodeJsFunctionProps = {
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
            runtime: aws_lambda_1.Runtime.NODEJS_20_X,
            timeout: aws_cdk_lib_1.Duration.seconds(30),
            memorySize: isProd ? 512 : 256,
            tracing: aws_lambda_1.Tracing.ACTIVE,
            logRetention: isProd ? aws_logs_1.RetentionDays.ONE_MONTH : aws_logs_1.RetentionDays.ONE_WEEK,
            reservedConcurrentExecutions: isProd ? 10 : undefined, // Limit concurrency in prod
            description: 'Ordering microservice Lambda function',
        };
        const orderFunction = new aws_lambda_nodejs_1.NodejsFunction(this, 'orderingLambdaFunction', {
            entry: (0, path_1.join)(__dirname, `/../src/ordering/index.js`),
            ...nodeJsFunctionProps,
            functionName: 'OrderingMicroservice',
        });
        orderTable.grantReadWriteData(orderFunction);
        return orderFunction;
    }
    createInventoryFunction(productTable, isProd) {
        const nodeJsFunctionProps = {
            bundling: {
                externalModules: ['@aws-sdk/*'],
                minify: true,
                sourceMap: !isProd,
            },
            environment: {
                PRIMARY_KEY: 'id', // Use product table's primary key
                DYNAMODB_TABLE_NAME: productTable.tableName, // Use product table
                NODE_ENV: isProd ? 'production' : 'development'
            },
            runtime: aws_lambda_1.Runtime.NODEJS_20_X,
            timeout: aws_cdk_lib_1.Duration.seconds(30),
            memorySize: isProd ? 512 : 256,
            tracing: aws_lambda_1.Tracing.ACTIVE,
            logRetention: isProd ? aws_logs_1.RetentionDays.ONE_MONTH : aws_logs_1.RetentionDays.ONE_WEEK,
            description: 'Inventory microservice Lambda function (uses Product table)',
        };
        const inventoryFunction = new aws_lambda_nodejs_1.NodejsFunction(this, 'inventoryLambdaFunction', {
            entry: (0, path_1.join)(__dirname, `/../src/inventory/index.js`),
            ...nodeJsFunctionProps,
            functionName: 'InventoryMicroservice',
        });
        productTable.grantReadWriteData(inventoryFunction); // Grant access to product table
        return inventoryFunction;
    }
}
exports.SwnMicroservices = SwnMicroservices;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWljcm9zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWljcm9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUF1QztBQUV2Qyx1REFBMEQ7QUFDMUQscUVBQW9GO0FBQ3BGLG1EQUFxRDtBQUNyRCwyQ0FBdUM7QUFDdkMsK0JBQTRCO0FBYTVCLE1BQWEsZ0JBQWlCLFNBQVEsc0JBQVM7SUFPN0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE0QjtRQUNwRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLElBQUksS0FBSyxDQUFDO1FBQy9DLE1BQU0sTUFBTSxHQUFHLFdBQVcsS0FBSyxNQUFNLENBQUM7UUFFdEMsd0JBQXdCO1FBQ3hCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNsRix1QkFBdUI7UUFDdkIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQy9FLHdCQUF3QjtRQUN4QixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbEYseUJBQXlCO1FBQ3pCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUN2RixDQUFDO0lBRU8scUJBQXFCLENBQUMsWUFBb0IsRUFBRSxNQUFlO1FBQ2pFLE1BQU0sbUJBQW1CLEdBQXdCO1lBQy9DLFFBQVEsRUFBRTtnQkFDUixlQUFlLEVBQUU7b0JBQ2YsWUFBWTtpQkFDYjtnQkFD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UyxFQUFFLENBQUMsTUFBTTthQUNuQjtZQUNELFdBQVcsRUFBRTtnQkFDWCxXQUFXLEVBQUUsSUFBSSxFQUFHLGtDQUFrQztnQkFDdEQsbUJBQW1CLEVBQUUsWUFBWSxDQUFDLFNBQVMsRUFBRyxvQkFBb0I7Z0JBQ2xFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsYUFBYTthQUNoRDtZQUNELE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7WUFDNUIsT0FBTyxFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUM3QixVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUc7WUFDOUIsT0FBTyxFQUFFLG9CQUFPLENBQUMsTUFBTTtZQUN2QixZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyx3QkFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsd0JBQWEsQ0FBQyxRQUFRO1lBQ3ZFLFdBQVcsRUFBRSw2REFBNkQ7U0FDM0UsQ0FBQztRQUVGLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxrQ0FBYyxDQUFDLElBQUksRUFBRSx5QkFBeUIsRUFBRTtZQUM1RSxLQUFLLEVBQUUsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLDRCQUE0QixDQUFDO1lBQ3BELEdBQUcsbUJBQW1CO1lBQ3RCLFlBQVksRUFBRSx1QkFBdUI7U0FDdEMsQ0FBQyxDQUFDO1FBRUgsWUFBWSxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBRSxnQ0FBZ0M7UUFDckYsT0FBTyxpQkFBaUIsQ0FBQztJQUMzQixDQUFDO0NBQ0Y7QUEzSkQsNENBMkpDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRHVyYXRpb24gfSBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7IElUYWJsZSB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGJcIjtcbmltcG9ydCB7IFJ1bnRpbWUsIFRyYWNpbmcgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxhbWJkYVwiO1xuaW1wb3J0IHsgTm9kZWpzRnVuY3Rpb24sIE5vZGVqc0Z1bmN0aW9uUHJvcHMgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxhbWJkYS1ub2RlanNcIjtcbmltcG9ydCB7IFJldGVudGlvbkRheXMgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxvZ3NcIjtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSBcInBhdGhcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTd25NaWNyb3NlcnZpY2VzUHJvcHMge1xuICBwcm9kdWN0VGFibGU6IElUYWJsZTtcbiAgYmFza2V0VGFibGU6IElUYWJsZTtcbiAgb3JkZXJUYWJsZTogSVRhYmxlO1xuICAvKipcbiAgICogRW52aXJvbm1lbnQgbmFtZSAoZS5nLiwgJ2RldicsICdwcm9kJylcbiAgICogQGRlZmF1bHQgJ2RldidcbiAgICovXG4gIGVudmlyb25tZW50Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgU3duTWljcm9zZXJ2aWNlcyBleHRlbmRzIENvbnN0cnVjdCB7XG5cbiAgcHVibGljIHJlYWRvbmx5IHByb2R1Y3RNaWNyb3NlcnZpY2U6IE5vZGVqc0Z1bmN0aW9uO1xuICBwdWJsaWMgcmVhZG9ubHkgYmFza2V0TWljcm9zZXJ2aWNlOiBOb2RlanNGdW5jdGlvbjtcbiAgcHVibGljIHJlYWRvbmx5IG9yZGVyaW5nTWljcm9zZXJ2aWNlOiBOb2RlanNGdW5jdGlvbjtcbiAgcHVibGljIHJlYWRvbmx5IGludmVudG9yeU1pY3Jvc2VydmljZTogTm9kZWpzRnVuY3Rpb247XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFN3bk1pY3Jvc2VydmljZXNQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBlbnZpcm9ubWVudCA9IHByb3BzLmVudmlyb25tZW50IHx8ICdkZXYnO1xuICAgIGNvbnN0IGlzUHJvZCA9IGVudmlyb25tZW50ID09PSAncHJvZCc7XG5cbiAgICAvLyBQcm9kdWN0IG1pY3Jvc2VydmljZXNcbiAgICB0aGlzLnByb2R1Y3RNaWNyb3NlcnZpY2UgPSB0aGlzLmNyZWF0ZVByb2R1Y3RGdW5jdGlvbihwcm9wcy5wcm9kdWN0VGFibGUsIGlzUHJvZCk7XG4gICAgLy8gQmFza2V0IG1pY3Jvc2VydmljZXNcbiAgICB0aGlzLmJhc2tldE1pY3Jvc2VydmljZSA9IHRoaXMuY3JlYXRlQmFza2V0RnVuY3Rpb24ocHJvcHMuYmFza2V0VGFibGUsIGlzUHJvZCk7XG4gICAgLy8gT3JkZXJpbmcgTWljcm9zZXJ2aWNlXG4gICAgdGhpcy5vcmRlcmluZ01pY3Jvc2VydmljZSA9IHRoaXMuY3JlYXRlT3JkZXJpbmdGdW5jdGlvbihwcm9wcy5vcmRlclRhYmxlLCBpc1Byb2QpO1xuICAgIC8vIEludmVudG9yeSBNaWNyb3NlcnZpY2VcbiAgICB0aGlzLmludmVudG9yeU1pY3Jvc2VydmljZSA9IHRoaXMuY3JlYXRlSW52ZW50b3J5RnVuY3Rpb24ocHJvcHMucHJvZHVjdFRhYmxlLCBpc1Byb2QpXG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVByb2R1Y3RGdW5jdGlvbihwcm9kdWN0VGFibGU6IElUYWJsZSwgaXNQcm9kOiBib29sZWFuKTogTm9kZWpzRnVuY3Rpb24ge1xuICAgIGNvbnN0IG5vZGVKc0Z1bmN0aW9uUHJvcHM6IE5vZGVqc0Z1bmN0aW9uUHJvcHMgPSB7XG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBleHRlcm5hbE1vZHVsZXM6IFtcbiAgICAgICAgICAnQGF3cy1zZGsvKidcbiAgICAgICAgXSxcbiAgICAgICAgbWluaWZ5OiB0cnVlLFxuICAgICAgICBzb3VyY2VNYXA6ICFpc1Byb2QsIC8vIFNvdXJjZSBtYXBzIGZvciBkZWJ1Z2dpbmcgaW4gZGV2XG4gICAgICB9LFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgUFJJTUFSWV9LRVk6ICdpZCcsXG4gICAgICAgIERZTkFNT0RCX1RBQkxFX05BTUU6IHByb2R1Y3RUYWJsZS50YWJsZU5hbWUsXG4gICAgICAgIE5PREVfRU5WOiBpc1Byb2QgPyAncHJvZHVjdGlvbicgOiAnZGV2ZWxvcG1lbnQnXG4gICAgICB9LFxuICAgICAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMjBfWCxcbiAgICAgIHRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoMzApLFxuICAgICAgbWVtb3J5U2l6ZTogaXNQcm9kID8gNTEyIDogMjU2LFxuICAgICAgdHJhY2luZzogVHJhY2luZy5BQ1RJVkUsXG4gICAgICBsb2dSZXRlbnRpb246IGlzUHJvZCA/IFJldGVudGlvbkRheXMuT05FX01PTlRIIDogUmV0ZW50aW9uRGF5cy5PTkVfV0VFSyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUHJvZHVjdCBtaWNyb3NlcnZpY2UgTGFtYmRhIGZ1bmN0aW9uJyxcbiAgICB9O1xuXG4gICAgLy8gUHJvZHVjdCBtaWNyb3NlcnZpY2VzIGxhbWJkYSBmdW5jdGlvblxuICAgIGNvbnN0IHByb2R1Y3RGdW5jdGlvbiA9IG5ldyBOb2RlanNGdW5jdGlvbih0aGlzLCAncHJvZHVjdExhbWJkYUZ1bmN0aW9uJywge1xuICAgICAgZW50cnk6IGpvaW4oX19kaXJuYW1lLCBgLy4uL3NyYy9wcm9kdWN0L2luZGV4LmpzYCksXG4gICAgICAuLi5ub2RlSnNGdW5jdGlvblByb3BzLFxuICAgICAgZnVuY3Rpb25OYW1lOiAnUHJvZHVjdE1pY3Jvc2VydmljZScsXG4gICAgfSk7XG5cbiAgICBwcm9kdWN0VGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKHByb2R1Y3RGdW5jdGlvbik7XG5cbiAgICByZXR1cm4gcHJvZHVjdEZ1bmN0aW9uO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVCYXNrZXRGdW5jdGlvbihiYXNrZXRUYWJsZTogSVRhYmxlLCBpc1Byb2Q6IGJvb2xlYW4pOiBOb2RlanNGdW5jdGlvbiB7XG4gICAgY29uc3QgYmFza2V0RnVuY3Rpb25Qcm9wczogTm9kZWpzRnVuY3Rpb25Qcm9wcyA9IHtcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGV4dGVybmFsTW9kdWxlczogW1xuICAgICAgICAgICdAYXdzLXNkay8qJ1xuICAgICAgICBdLFxuICAgICAgICBtaW5pZnk6IHRydWUsXG4gICAgICAgIHNvdXJjZU1hcDogIWlzUHJvZCxcbiAgICAgIH0sXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBQUklNQVJZX0tFWTogJ3VzZXJOYW1lJyxcbiAgICAgICAgRFlOQU1PREJfVEFCTEVfTkFNRTogYmFza2V0VGFibGUudGFibGVOYW1lLFxuICAgICAgICBFVkVOVF9TT1VSQ0U6IFwiY29tLnN3bi5iYXNrZXQuY2hlY2tvdXRiYXNrZXRcIixcbiAgICAgICAgRVZFTlRfREVUQUlMVFlQRTogXCJDaGVja291dEJhc2tldFwiLFxuICAgICAgICBFVkVOVF9CVVNOQU1FOiBcIlN3bkV2ZW50QnVzXCIsXG4gICAgICAgIE5PREVfRU5WOiBpc1Byb2QgPyAncHJvZHVjdGlvbicgOiAnZGV2ZWxvcG1lbnQnXG4gICAgICB9LFxuICAgICAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMjBfWCxcbiAgICAgIHRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoMzApLFxuICAgICAgbWVtb3J5U2l6ZTogaXNQcm9kID8gNTEyIDogMjU2LFxuICAgICAgdHJhY2luZzogVHJhY2luZy5BQ1RJVkUsXG4gICAgICBsb2dSZXRlbnRpb246IGlzUHJvZCA/IFJldGVudGlvbkRheXMuT05FX01PTlRIIDogUmV0ZW50aW9uRGF5cy5PTkVfV0VFSyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQmFza2V0IG1pY3Jvc2VydmljZSBMYW1iZGEgZnVuY3Rpb24gd2l0aCBFdmVudEJyaWRnZSBpbnRlZ3JhdGlvbicsXG4gICAgfTtcblxuICAgIGNvbnN0IGJhc2tldEZ1bmN0aW9uID0gbmV3IE5vZGVqc0Z1bmN0aW9uKHRoaXMsICdiYXNrZXRMYW1iZGFGdW5jdGlvbicsIHtcbiAgICAgIGVudHJ5OiBqb2luKF9fZGlybmFtZSwgYC8uLi9zcmMvYmFza2V0L2luZGV4LmpzYCksXG4gICAgICAuLi5iYXNrZXRGdW5jdGlvblByb3BzLFxuICAgICAgZnVuY3Rpb25OYW1lOiAnQmFza2V0TWljcm9zZXJ2aWNlJyxcbiAgICB9KTtcblxuICAgIGJhc2tldFRhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShiYXNrZXRGdW5jdGlvbik7XG4gICAgcmV0dXJuIGJhc2tldEZ1bmN0aW9uO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVPcmRlcmluZ0Z1bmN0aW9uKG9yZGVyVGFibGU6IElUYWJsZSwgaXNQcm9kOiBib29sZWFuKTogTm9kZWpzRnVuY3Rpb24ge1xuICAgIGNvbnN0IG5vZGVKc0Z1bmN0aW9uUHJvcHM6IE5vZGVqc0Z1bmN0aW9uUHJvcHMgPSB7XG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBleHRlcm5hbE1vZHVsZXM6IFtcbiAgICAgICAgICAnQGF3cy1zZGsvKidcbiAgICAgICAgXSxcbiAgICAgICAgbWluaWZ5OiB0cnVlLFxuICAgICAgICBzb3VyY2VNYXA6ICFpc1Byb2QsXG4gICAgICB9LFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgUFJJTUFSWV9LRVk6ICd1c2VyTmFtZScsXG4gICAgICAgIFNPUlRfS0VZOiAnb3JkZXJEYXRlJyxcbiAgICAgICAgRFlOQU1PREJfVEFCTEVfTkFNRTogb3JkZXJUYWJsZS50YWJsZU5hbWUsXG4gICAgICAgIE5PREVfRU5WOiBpc1Byb2QgPyAncHJvZHVjdGlvbicgOiAnZGV2ZWxvcG1lbnQnXG4gICAgICB9LFxuICAgICAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMjBfWCxcbiAgICAgIHRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoMzApLFxuICAgICAgbWVtb3J5U2l6ZTogaXNQcm9kID8gNTEyIDogMjU2LFxuICAgICAgdHJhY2luZzogVHJhY2luZy5BQ1RJVkUsXG4gICAgICBsb2dSZXRlbnRpb246IGlzUHJvZCA/IFJldGVudGlvbkRheXMuT05FX01PTlRIIDogUmV0ZW50aW9uRGF5cy5PTkVfV0VFSyxcbiAgICAgIHJlc2VydmVkQ29uY3VycmVudEV4ZWN1dGlvbnM6IGlzUHJvZCA/IDEwIDogdW5kZWZpbmVkLCAvLyBMaW1pdCBjb25jdXJyZW5jeSBpbiBwcm9kXG4gICAgICBkZXNjcmlwdGlvbjogJ09yZGVyaW5nIG1pY3Jvc2VydmljZSBMYW1iZGEgZnVuY3Rpb24nLFxuICAgIH07XG5cbiAgICBjb25zdCBvcmRlckZ1bmN0aW9uID0gbmV3IE5vZGVqc0Z1bmN0aW9uKHRoaXMsICdvcmRlcmluZ0xhbWJkYUZ1bmN0aW9uJywge1xuICAgICAgZW50cnk6IGpvaW4oX19kaXJuYW1lLCBgLy4uL3NyYy9vcmRlcmluZy9pbmRleC5qc2ApLFxuICAgICAgLi4ubm9kZUpzRnVuY3Rpb25Qcm9wcyxcbiAgICAgIGZ1bmN0aW9uTmFtZTogJ09yZGVyaW5nTWljcm9zZXJ2aWNlJyxcbiAgICB9KTtcblxuICAgIG9yZGVyVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKG9yZGVyRnVuY3Rpb24pO1xuICAgIHJldHVybiBvcmRlckZ1bmN0aW9uO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVJbnZlbnRvcnlGdW5jdGlvbihwcm9kdWN0VGFibGU6IElUYWJsZSwgaXNQcm9kOiBib29sZWFuKTogTm9kZWpzRnVuY3Rpb24ge1xuICAgIGNvbnN0IG5vZGVKc0Z1bmN0aW9uUHJvcHM6IE5vZGVqc0Z1bmN0aW9uUHJvcHMgPSB7XG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBleHRlcm5hbE1vZHVsZXM6IFsnQGF3cy1zZGsvKiddLFxuICAgICAgICBtaW5pZnk6IHRydWUsXG4gICAgICAgIHNvdXJjZU1hcDogIWlzUHJvZCxcbiAgICAgIH0sXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBQUklNQVJZX0tFWTogJ2lkJywgIC8vIFVzZSBwcm9kdWN0IHRhYmxlJ3MgcHJpbWFyeSBrZXlcbiAgICAgICAgRFlOQU1PREJfVEFCTEVfTkFNRTogcHJvZHVjdFRhYmxlLnRhYmxlTmFtZSwgIC8vIFVzZSBwcm9kdWN0IHRhYmxlXG4gICAgICAgIE5PREVfRU5WOiBpc1Byb2QgPyAncHJvZHVjdGlvbicgOiAnZGV2ZWxvcG1lbnQnXG4gICAgICB9LFxuICAgICAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMjBfWCxcbiAgICAgIHRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoMzApLFxuICAgICAgbWVtb3J5U2l6ZTogaXNQcm9kID8gNTEyIDogMjU2LFxuICAgICAgdHJhY2luZzogVHJhY2luZy5BQ1RJVkUsXG4gICAgICBsb2dSZXRlbnRpb246IGlzUHJvZCA/IFJldGVudGlvbkRheXMuT05FX01PTlRIIDogUmV0ZW50aW9uRGF5cy5PTkVfV0VFSyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnSW52ZW50b3J5IG1pY3Jvc2VydmljZSBMYW1iZGEgZnVuY3Rpb24gKHVzZXMgUHJvZHVjdCB0YWJsZSknLFxuICAgIH07XG5cbiAgICBjb25zdCBpbnZlbnRvcnlGdW5jdGlvbiA9IG5ldyBOb2RlanNGdW5jdGlvbih0aGlzLCAnaW52ZW50b3J5TGFtYmRhRnVuY3Rpb24nLCB7XG4gICAgICBlbnRyeTogam9pbihfX2Rpcm5hbWUsIGAvLi4vc3JjL2ludmVudG9yeS9pbmRleC5qc2ApLFxuICAgICAgLi4ubm9kZUpzRnVuY3Rpb25Qcm9wcyxcbiAgICAgIGZ1bmN0aW9uTmFtZTogJ0ludmVudG9yeU1pY3Jvc2VydmljZScsXG4gICAgfSk7XG5cbiAgICBwcm9kdWN0VGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGludmVudG9yeUZ1bmN0aW9uKTsgIC8vIEdyYW50IGFjY2VzcyB0byBwcm9kdWN0IHRhYmxlXG4gICAgcmV0dXJuIGludmVudG9yeUZ1bmN0aW9uO1xuICB9XG59Il19