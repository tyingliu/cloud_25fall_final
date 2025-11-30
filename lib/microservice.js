"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwnMicroservices = void 0;
// /Users/tzuying/CS6620/final project/aws-microservices/lib/microservice.ts
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWljcm9zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWljcm9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRFQUE0RTtBQUM1RSw2Q0FBdUM7QUFFdkMsdURBQTBEO0FBQzFELHFFQUFvRjtBQUNwRixtREFBcUQ7QUFDckQsMkNBQXVDO0FBQ3ZDLCtCQUE0QjtBQWE1QixNQUFhLGdCQUFpQixTQUFRLHNCQUFTO0lBTzdDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBNEI7UUFDcEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxJQUFJLEtBQUssQ0FBQztRQUMvQyxNQUFNLE1BQU0sR0FBRyxXQUFXLEtBQUssTUFBTSxDQUFDO1FBRXRDLHdCQUF3QjtRQUN4QixJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbEYsdUJBQXVCO1FBQ3ZCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMvRSx3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2xGLHlCQUF5QjtRQUN6QixJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFDdkYsQ0FBQztJQUVPLHFCQUFxQixDQUFDLFlBQW9CLEVBQUUsTUFBZTtRQUNqRSxNQUFNLG1CQUFtQixHQUF3QjtZQUMvQyxRQUFRLEVBQUU7Z0JBQ1IsZUFBZSxFQUFFO29CQUNmLFlB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QUFJO2dCQUNaLFNBQVMsRUFBRSxDQUFDLE1BQU07YUFDbkI7WUFDRCxXQUFXLEVBQUU7Z0JBQ1gsV0FBVyxFQUFFLElBQUksRUFBRyxrQ0FBa0M7Z0JBQ3RELG1CQUFtQixFQUFFLFlBQVksQ0FBQyxTQUFTLEVBQUcsb0JBQW9CO2dCQUNsRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGFBQWE7YUFDaEQ7WUFDRCxPQUFPLEVBQUUsb0JBQU8sQ0FBQyxXQUFXO1lBQzVCLE9BQU8sRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDN0IsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHO1lBQzlCLE9BQU8sRUFBRSxvQkFBTyxDQUFDLE1BQU07WUFDdkIsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsd0JBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHdCQUFhLENBQUMsUUFBUTtZQUN2RSxXQUFXLEVBQUUsNkRBQTZEO1NBQzNFLENBQUM7UUFFRixNQUFNLGlCQUFpQixHQUFHLElBQUksa0NBQWMsQ0FBQyxJQUFJLEVBQUUseUJBQXlCLEVBQUU7WUFDNUUsS0FBSyxFQUFFLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSw0QkFBNEIsQ0FBQztZQUNwRCxHQUFHLG1CQUFtQjtZQUN0QixZQUFZLEVBQUUsdUJBQXVCO1NBQ3RDLENBQUMsQ0FBQztRQUVILFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUUsZ0NBQWdDO1FBQ3JGLE9BQU8saUJBQWlCLENBQUM7SUFDM0IsQ0FBQztDQUNGO0FBM0pELDRDQTJKQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIC9Vc2Vycy90enV5aW5nL0NTNjYyMC9maW5hbCBwcm9qZWN0L2F3cy1taWNyb3NlcnZpY2VzL2xpYi9taWNyb3NlcnZpY2UudHNcbmltcG9ydCB7IER1cmF0aW9uIH0gZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgeyBJVGFibGUgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiXCI7XG5pbXBvcnQgeyBSdW50aW1lLCBUcmFjaW5nIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGFcIjtcbmltcG9ydCB7IE5vZGVqc0Z1bmN0aW9uLCBOb2RlanNGdW5jdGlvblByb3BzIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGEtbm9kZWpzXCI7XG5pbXBvcnQgeyBSZXRlbnRpb25EYXlzIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1sb2dzXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gXCJwYXRoXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3duTWljcm9zZXJ2aWNlc1Byb3BzIHtcbiAgcHJvZHVjdFRhYmxlOiBJVGFibGU7XG4gIGJhc2tldFRhYmxlOiBJVGFibGU7XG4gIG9yZGVyVGFibGU6IElUYWJsZTtcbiAgLyoqXG4gICAqIEVudmlyb25tZW50IG5hbWUgKGUuZy4sICdkZXYnLCAncHJvZCcpXG4gICAqIEBkZWZhdWx0ICdkZXYnXG4gICAqL1xuICBlbnZpcm9ubWVudD86IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIFN3bk1pY3Jvc2VydmljZXMgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gIHB1YmxpYyByZWFkb25seSBwcm9kdWN0TWljcm9zZXJ2aWNlOiBOb2RlanNGdW5jdGlvbjtcbiAgcHVibGljIHJlYWRvbmx5IGJhc2tldE1pY3Jvc2VydmljZTogTm9kZWpzRnVuY3Rpb247XG4gIHB1YmxpYyByZWFkb25seSBvcmRlcmluZ01pY3Jvc2VydmljZTogTm9kZWpzRnVuY3Rpb247XG4gIHB1YmxpYyByZWFkb25seSBpbnZlbnRvcnlNaWNyb3NlcnZpY2U6IE5vZGVqc0Z1bmN0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTd25NaWNyb3NlcnZpY2VzUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgZW52aXJvbm1lbnQgPSBwcm9wcy5lbnZpcm9ubWVudCB8fCAnZGV2JztcbiAgICBjb25zdCBpc1Byb2QgPSBlbnZpcm9ubWVudCA9PT0gJ3Byb2QnO1xuXG4gICAgLy8gUHJvZHVjdCBtaWNyb3NlcnZpY2VzXG4gICAgdGhpcy5wcm9kdWN0TWljcm9zZXJ2aWNlID0gdGhpcy5jcmVhdGVQcm9kdWN0RnVuY3Rpb24ocHJvcHMucHJvZHVjdFRhYmxlLCBpc1Byb2QpO1xuICAgIC8vIEJhc2tldCBtaWNyb3NlcnZpY2VzXG4gICAgdGhpcy5iYXNrZXRNaWNyb3NlcnZpY2UgPSB0aGlzLmNyZWF0ZUJhc2tldEZ1bmN0aW9uKHByb3BzLmJhc2tldFRhYmxlLCBpc1Byb2QpO1xuICAgIC8vIE9yZGVyaW5nIE1pY3Jvc2VydmljZVxuICAgIHRoaXMub3JkZXJpbmdNaWNyb3NlcnZpY2UgPSB0aGlzLmNyZWF0ZU9yZGVyaW5nRnVuY3Rpb24ocHJvcHMub3JkZXJUYWJsZSwgaXNQcm9kKTtcbiAgICAvLyBJbnZlbnRvcnkgTWljcm9zZXJ2aWNlXG4gICAgdGhpcy5pbnZlbnRvcnlNaWNyb3NlcnZpY2UgPSB0aGlzLmNyZWF0ZUludmVudG9yeUZ1bmN0aW9uKHByb3BzLnByb2R1Y3RUYWJsZSwgaXNQcm9kKVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVQcm9kdWN0RnVuY3Rpb24ocHJvZHVjdFRhYmxlOiBJVGFibGUsIGlzUHJvZDogYm9vbGVhbik6IE5vZGVqc0Z1bmN0aW9uIHtcbiAgICBjb25zdCBub2RlSnNGdW5jdGlvblByb3BzOiBOb2RlanNGdW5jdGlvblByb3BzID0ge1xuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgZXh0ZXJuYWxNb2R1bGVzOiBbXG4gICAgICAgICAgJ0Bhd3Mtc2RrLyonXG4gICAgICAgIF0sXG4gICAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgICAgc291cmNlTWFwOiAhaXNQcm9kLCAvLyBTb3VyY2UgbWFwcyBmb3IgZGVidWdnaW5nIGluIGRldlxuICAgICAgfSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFBSSU1BUllfS0VZOiAnaWQnLFxuICAgICAgICBEWU5BTU9EQl9UQUJMRV9OQU1FOiBwcm9kdWN0VGFibGUudGFibGVOYW1lLFxuICAgICAgICBOT0RFX0VOVjogaXNQcm9kID8gJ3Byb2R1Y3Rpb24nIDogJ2RldmVsb3BtZW50J1xuICAgICAgfSxcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzIwX1gsXG4gICAgICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDMwKSxcbiAgICAgIG1lbW9yeVNpemU6IGlzUHJvZCA/IDUxMiA6IDI1NixcbiAgICAgIHRyYWNpbmc6IFRyYWNpbmcuQUNUSVZFLFxuICAgICAgbG9nUmV0ZW50aW9uOiBpc1Byb2QgPyBSZXRlbnRpb25EYXlzLk9ORV9NT05USCA6IFJldGVudGlvbkRheXMuT05FX1dFRUssXG4gICAgICBkZXNjcmlwdGlvbjogJ1Byb2R1Y3QgbWljcm9zZXJ2aWNlIExhbWJkYSBmdW5jdGlvbicsXG4gICAgfTtcblxuICAgIC8vIFByb2R1Y3QgbWljcm9zZXJ2aWNlcyBsYW1iZGEgZnVuY3Rpb25cbiAgICBjb25zdCBwcm9kdWN0RnVuY3Rpb24gPSBuZXcgTm9kZWpzRnVuY3Rpb24odGhpcywgJ3Byb2R1Y3RMYW1iZGFGdW5jdGlvbicsIHtcbiAgICAgIGVudHJ5OiBqb2luKF9fZGlybmFtZSwgYC8uLi9zcmMvcHJvZHVjdC9pbmRleC5qc2ApLFxuICAgICAgLi4ubm9kZUpzRnVuY3Rpb25Qcm9wcyxcbiAgICAgIGZ1bmN0aW9uTmFtZTogJ1Byb2R1Y3RNaWNyb3NlcnZpY2UnLFxuICAgIH0pO1xuXG4gICAgcHJvZHVjdFRhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShwcm9kdWN0RnVuY3Rpb24pO1xuXG4gICAgcmV0dXJuIHByb2R1Y3RGdW5jdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQmFza2V0RnVuY3Rpb24oYmFza2V0VGFibGU6IElUYWJsZSwgaXNQcm9kOiBib29sZWFuKTogTm9kZWpzRnVuY3Rpb24ge1xuICAgIGNvbnN0IGJhc2tldEZ1bmN0aW9uUHJvcHM6IE5vZGVqc0Z1bmN0aW9uUHJvcHMgPSB7XG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBleHRlcm5hbE1vZHVsZXM6IFtcbiAgICAgICAgICAnQGF3cy1zZGsvKidcbiAgICAgICAgXSxcbiAgICAgICAgbWluaWZ5OiB0cnVlLFxuICAgICAgICBzb3VyY2VNYXA6ICFpc1Byb2QsXG4gICAgICB9LFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgUFJJTUFSWV9LRVk6ICd1c2VyTmFtZScsXG4gICAgICAgIERZTkFNT0RCX1RBQkxFX05BTUU6IGJhc2tldFRhYmxlLnRhYmxlTmFtZSxcbiAgICAgICAgRVZFTlRfU09VUkNFOiBcImNvbS5zd24uYmFza2V0LmNoZWNrb3V0YmFza2V0XCIsXG4gICAgICAgIEVWRU5UX0RFVEFJTFRZUEU6IFwiQ2hlY2tvdXRCYXNrZXRcIixcbiAgICAgICAgRVZFTlRfQlVTTkFNRTogXCJTd25FdmVudEJ1c1wiLFxuICAgICAgICBOT0RFX0VOVjogaXNQcm9kID8gJ3Byb2R1Y3Rpb24nIDogJ2RldmVsb3BtZW50J1xuICAgICAgfSxcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzIwX1gsXG4gICAgICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDMwKSxcbiAgICAgIG1lbW9yeVNpemU6IGlzUHJvZCA/IDUxMiA6IDI1NixcbiAgICAgIHRyYWNpbmc6IFRyYWNpbmcuQUNUSVZFLFxuICAgICAgbG9nUmV0ZW50aW9uOiBpc1Byb2QgPyBSZXRlbnRpb25EYXlzLk9ORV9NT05USCA6IFJldGVudGlvbkRheXMuT05FX1dFRUssXG4gICAgICBkZXNjcmlwdGlvbjogJ0Jhc2tldCBtaWNyb3NlcnZpY2UgTGFtYmRhIGZ1bmN0aW9uIHdpdGggRXZlbnRCcmlkZ2UgaW50ZWdyYXRpb24nLFxuICAgIH07XG5cbiAgICBjb25zdCBiYXNrZXRGdW5jdGlvbiA9IG5ldyBOb2RlanNGdW5jdGlvbih0aGlzLCAnYmFza2V0TGFtYmRhRnVuY3Rpb24nLCB7XG4gICAgICBlbnRyeTogam9pbihfX2Rpcm5hbWUsIGAvLi4vc3JjL2Jhc2tldC9pbmRleC5qc2ApLFxuICAgICAgLi4uYmFza2V0RnVuY3Rpb25Qcm9wcyxcbiAgICAgIGZ1bmN0aW9uTmFtZTogJ0Jhc2tldE1pY3Jvc2VydmljZScsXG4gICAgfSk7XG5cbiAgICBiYXNrZXRUYWJsZS5ncmFudFJlYWRXcml0ZURhdGEoYmFza2V0RnVuY3Rpb24pO1xuICAgIHJldHVybiBiYXNrZXRGdW5jdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlT3JkZXJpbmdGdW5jdGlvbihvcmRlclRhYmxlOiBJVGFibGUsIGlzUHJvZDogYm9vbGVhbik6IE5vZGVqc0Z1bmN0aW9uIHtcbiAgICBjb25zdCBub2RlSnNGdW5jdGlvblByb3BzOiBOb2RlanNGdW5jdGlvblByb3BzID0ge1xuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgZXh0ZXJuYWxNb2R1bGVzOiBbXG4gICAgICAgICAgJ0Bhd3Mtc2RrLyonXG4gICAgICAgIF0sXG4gICAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgICAgc291cmNlTWFwOiAhaXNQcm9kLFxuICAgICAgfSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFBSSU1BUllfS0VZOiAndXNlck5hbWUnLFxuICAgICAgICBTT1JUX0tFWTogJ29yZGVyRGF0ZScsXG4gICAgICAgIERZTkFNT0RCX1RBQkxFX05BTUU6IG9yZGVyVGFibGUudGFibGVOYW1lLFxuICAgICAgICBOT0RFX0VOVjogaXNQcm9kID8gJ3Byb2R1Y3Rpb24nIDogJ2RldmVsb3BtZW50J1xuICAgICAgfSxcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzIwX1gsXG4gICAgICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDMwKSxcbiAgICAgIG1lbW9yeVNpemU6IGlzUHJvZCA/IDUxMiA6IDI1NixcbiAgICAgIHRyYWNpbmc6IFRyYWNpbmcuQUNUSVZFLFxuICAgICAgbG9nUmV0ZW50aW9uOiBpc1Byb2QgPyBSZXRlbnRpb25EYXlzLk9ORV9NT05USCA6IFJldGVudGlvbkRheXMuT05FX1dFRUssXG4gICAgICByZXNlcnZlZENvbmN1cnJlbnRFeGVjdXRpb25zOiBpc1Byb2QgPyAxMCA6IHVuZGVmaW5lZCwgLy8gTGltaXQgY29uY3VycmVuY3kgaW4gcHJvZFxuICAgICAgZGVzY3JpcHRpb246ICdPcmRlcmluZyBtaWNyb3NlcnZpY2UgTGFtYmRhIGZ1bmN0aW9uJyxcbiAgICB9O1xuXG4gICAgY29uc3Qgb3JkZXJGdW5jdGlvbiA9IG5ldyBOb2RlanNGdW5jdGlvbih0aGlzLCAnb3JkZXJpbmdMYW1iZGFGdW5jdGlvbicsIHtcbiAgICAgIGVudHJ5OiBqb2luKF9fZGlybmFtZSwgYC8uLi9zcmMvb3JkZXJpbmcvaW5kZXguanNgKSxcbiAgICAgIC4uLm5vZGVKc0Z1bmN0aW9uUHJvcHMsXG4gICAgICBmdW5jdGlvbk5hbWU6ICdPcmRlcmluZ01pY3Jvc2VydmljZScsXG4gICAgfSk7XG5cbiAgICBvcmRlclRhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShvcmRlckZ1bmN0aW9uKTtcbiAgICByZXR1cm4gb3JkZXJGdW5jdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlSW52ZW50b3J5RnVuY3Rpb24ocHJvZHVjdFRhYmxlOiBJVGFibGUsIGlzUHJvZDogYm9vbGVhbik6IE5vZGVqc0Z1bmN0aW9uIHtcbiAgICBjb25zdCBub2RlSnNGdW5jdGlvblByb3BzOiBOb2RlanNGdW5jdGlvblByb3BzID0ge1xuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgZXh0ZXJuYWxNb2R1bGVzOiBbJ0Bhd3Mtc2RrLyonXSxcbiAgICAgICAgbWluaWZ5OiB0cnVlLFxuICAgICAgICBzb3VyY2VNYXA6ICFpc1Byb2QsXG4gICAgICB9LFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgUFJJTUFSWV9LRVk6ICdpZCcsICAvLyBVc2UgcHJvZHVjdCB0YWJsZSdzIHByaW1hcnkga2V5XG4gICAgICAgIERZTkFNT0RCX1RBQkxFX05BTUU6IHByb2R1Y3RUYWJsZS50YWJsZU5hbWUsICAvLyBVc2UgcHJvZHVjdCB0YWJsZVxuICAgICAgICBOT0RFX0VOVjogaXNQcm9kID8gJ3Byb2R1Y3Rpb24nIDogJ2RldmVsb3BtZW50J1xuICAgICAgfSxcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzIwX1gsXG4gICAgICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDMwKSxcbiAgICAgIG1lbW9yeVNpemU6IGlzUHJvZCA/IDUxMiA6IDI1NixcbiAgICAgIHRyYWNpbmc6IFRyYWNpbmcuQUNUSVZFLFxuICAgICAgbG9nUmV0ZW50aW9uOiBpc1Byb2QgPyBSZXRlbnRpb25EYXlzLk9ORV9NT05USCA6IFJldGVudGlvbkRheXMuT05FX1dFRUssXG4gICAgICBkZXNjcmlwdGlvbjogJ0ludmVudG9yeSBtaWNyb3NlcnZpY2UgTGFtYmRhIGZ1bmN0aW9uICh1c2VzIFByb2R1Y3QgdGFibGUpJyxcbiAgICB9O1xuXG4gICAgY29uc3QgaW52ZW50b3J5RnVuY3Rpb24gPSBuZXcgTm9kZWpzRnVuY3Rpb24odGhpcywgJ2ludmVudG9yeUxhbWJkYUZ1bmN0aW9uJywge1xuICAgICAgZW50cnk6IGpvaW4oX19kaXJuYW1lLCBgLy4uL3NyYy9pbnZlbnRvcnkvaW5kZXguanNgKSxcbiAgICAgIC4uLm5vZGVKc0Z1bmN0aW9uUHJvcHMsXG4gICAgICBmdW5jdGlvbk5hbWU6ICdJbnZlbnRvcnlNaWNyb3NlcnZpY2UnLFxuICAgIH0pO1xuXG4gICAgcHJvZHVjdFRhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShpbnZlbnRvcnlGdW5jdGlvbik7ICAvLyBHcmFudCBhY2Nlc3MgdG8gcHJvZHVjdCB0YWJsZVxuICAgIHJldHVybiBpbnZlbnRvcnlGdW5jdGlvbjtcbiAgfVxufSJdfQ==