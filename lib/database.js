"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwnDatabase = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const constructs_1 = require("constructs");
class SwnDatabase extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const environment = (props === null || props === void 0 ? void 0 : props.environment) || 'dev';
        const isProd = environment === 'prod';
        // Product table
        this.productTable = this.createProductTable(isProd);
        // Basket table
        this.basketTable = this.createBasketTable(isProd);
        // Order table
        this.orderTable = this.createOrderTable(isProd);
    }
    // Product DynamoDb Table Creation
    // product : PK: id -- name - description - imageFile - price - category
    createProductTable(isProd) {
        const productTable = new aws_dynamodb_1.Table(this, 'product', {
            partitionKey: {
                name: 'id',
                type: aws_dynamodb_1.AttributeType.STRING
            },
            tableName: 'product',
            removalPolicy: isProd ? aws_cdk_lib_1.RemovalPolicy.RETAIN : aws_cdk_lib_1.RemovalPolicy.DESTROY,
            billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
            encryption: aws_dynamodb_1.TableEncryption.AWS_MANAGED,
            pointInTimeRecovery: isProd,
            deletionProtection: isProd,
        });
        return productTable;
    }
    // Basket DynamoDb Table Creation
    // basket : PK: userName -- items (SET-MAP object) 
    // item1 - { quantity - color - price - productId - productName }
    // item2 - { quantity - color - price - productId - productName }
    createBasketTable(isProd) {
        const basketTable = new aws_dynamodb_1.Table(this, 'basket', {
            partitionKey: {
                name: 'userName',
                type: aws_dynamodb_1.AttributeType.STRING,
            },
            tableName: 'basket',
            removalPolicy: isProd ? aws_cdk_lib_1.RemovalPolicy.RETAIN : aws_cdk_lib_1.RemovalPolicy.DESTROY,
            billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
            encryption: aws_dynamodb_1.TableEncryption.AWS_MANAGED,
            pointInTimeRecovery: isProd,
            deletionProtection: isProd,
        });
        return basketTable;
    }
    // Order DynamoDb Table Creation
    // order : PK: userName - SK: orderDate -- totalPrice - firstName - lastName - email - address - paymentMethod - cardInfo
    createOrderTable(isProd) {
        const orderTable = new aws_dynamodb_1.Table(this, 'order', {
            partitionKey: {
                name: 'userName',
                type: aws_dynamodb_1.AttributeType.STRING,
            },
            sortKey: {
                name: 'orderDate',
                type: aws_dynamodb_1.AttributeType.STRING,
            },
            tableName: 'order',
            removalPolicy: isProd ? aws_cdk_lib_1.RemovalPolicy.RETAIN : aws_cdk_lib_1.RemovalPolicy.DESTROY,
            billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
            encryption: aws_dynamodb_1.TableEncryption.AWS_MANAGED,
            pointInTimeRecovery: isProd,
            deletionProtection: isProd,
        });
        return orderTable;
    }
}
exports.SwnDatabase = SwnDatabase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkYXRhYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBbUQ7QUFDbkQsMkRBQXNHO0FBQ3RHLDJDQUF1QztBQVV2QyxNQUFhLFdBQVksU0FBUSxzQkFBUztJQU14QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXdCO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxXQUFXLEdBQUcsQ0FBQSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsV0FBVyxLQUFJLEtBQUssQ0FBQztRQUNoRCxNQUFNLE1BQU0sR0FBRyxXQUFXLEtBQUssTUFBTSxDQUFDO1FBRXRDLGdCQUFnQjtRQUNoQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwRCxlQUFlO1FBQ2YsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEQsY0FBYztRQUNkLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxrQ0FBa0M7SUFDbEMsd0VBQXdFO0lBQ2hFLGtCQUFrQixDQUFDLE1BQWU7UUFDeEMsTUFBTSxZQUFZLEdBQUcsSUFBSSxvQkFBSyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDOUMsWUFBWSxFQUFFO2dCQUNaLElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSw0QkFBYSxDQUFDLE1BQU07YUFDM0I7WUFDRCxTQUFTLEVBQUUsU0FBUztZQUNwQixhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQywyQkFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsMkJBQWEsQ0FBQyxPQUFPO1lBQ3BFLFdBQVcsRUFBRSwwQkFBVyxDQUFDLGVBQWU7WUFDeEMsVUFBVSxFQUFFLDhCQUFlLENBQUMsV0FBVztZQUN2QyxtQkFBbUIsRUFBRSxNQUFNO1lBQzNCLGtCQUFrQixFQUFFLE1BQU07U0FDM0IsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVELGlDQUFpQztJQUNqQyxtREFBbUQ7SUFDbkQsaUVBQWlFO0lBQ2pFLGlFQUFpRTtJQUN6RCxpQkFBaUIsQ0FBQyxNQUFlO1FBQ3ZDLE1BQU0sV0FBVyxHQUFHLElBQUksb0JBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQzVDLFlBQVksRUFBRTtnQkFDWixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsSUFBSSxFQUFFLDRCQUFhLENBQUMsTUFBTTthQUMzQjtZQUNELFNBQVMsRUFBRSxRQUFRO1lBQ25CLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLDJCQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQywyQkFBYSxDQUFDLE9BQU87WUFDcEUsV0FBVyxFQUFFLDBCQUFXLENBQUMsZUFBZTtZQUN4QyxVQUFVLEVBQUUsOEJBQWUsQ0FBQyxXQUFXO1lBQ3ZDLG1CQUFtQixFQUFFLE1BQU07WUFDM0Isa0JBQWtCLEVBQUUsTUFBTTtTQUMzQixDQUFDLENBQUM7UUFDSCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRUQsZ0NBQWdDO0lBQ2hDLHlIQUF5SDtJQUNqSCxnQkFBZ0IsQ0FBQyxNQUFlO1FBQ3RDLE1BQU0sVUFBVSxHQUFHLElBQUksb0JBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQzFDLFlBQVksRUFBRTtnQkFDWixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsSUFBSSxFQUFFLDRCQUFhLENBQUMsTUFBTTthQUMzQjtZQUNELE9BQU8sRUFBRTtnQkFDUCxJQUFJLEVBQUUsV0FBVztnQkFDakIsSUFBSSxFQUFFLDRCQUFhLENBQUMsTUFBTTthQUMzQjtZQUNELFNBQVMsRUFBRSxPQUFPO1lBQ2xCLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLDJCQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQywyQkFBYSxDQUFDLE9BQU87WUFDcEUsV0FBVyxFQUFFLDBCQUFXLENBQUMsZUFBZTtZQUN4QyxVQUFVLEVBQUUsOEJBQWUsQ0FBQyxXQUFXO1lBQ3ZDLG1CQUFtQixFQUFFLE1BQU07WUFDM0Isa0JBQWtCLEVBQUUsTUFBTTtTQUMzQixDQUFDLENBQUM7UUFDSCxPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDO0NBQ0Y7QUEvRUQsa0NBK0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVtb3ZhbFBvbGljeSwgU3RhY2sgfSBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7IEF0dHJpYnV0ZVR5cGUsIEJpbGxpbmdNb2RlLCBJVGFibGUsIFRhYmxlLCBUYWJsZUVuY3J5cHRpb24gfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN3bkRhdGFiYXNlUHJvcHMge1xuICAvKipcbiAgICogRW52aXJvbm1lbnQgbmFtZSAoZS5nLiwgJ2RldicsICdwcm9kJylcbiAgICogQGRlZmF1bHQgJ2RldidcbiAgICovXG4gIHJlYWRvbmx5IGVudmlyb25tZW50Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgU3duRGF0YWJhc2UgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gIHB1YmxpYyByZWFkb25seSBwcm9kdWN0VGFibGU6IElUYWJsZTtcbiAgcHVibGljIHJlYWRvbmx5IGJhc2tldFRhYmxlOiBJVGFibGU7XG4gIHB1YmxpYyByZWFkb25seSBvcmRlclRhYmxlOiBJVGFibGU7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTd25EYXRhYmFzZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IGVudmlyb25tZW50ID0gcHJvcHM/LmVudmlyb25tZW50IHx8ICdkZXYnO1xuICAgIGNvbnN0IGlzUHJvZCA9IGVudmlyb25tZW50ID09PSAncHJvZCc7XG5cbiAgICAvLyBQcm9kdWN0IHRhYmxlXG4gICAgdGhpcy5wcm9kdWN0VGFibGUgPSB0aGlzLmNyZWF0ZVByb2R1Y3RUYWJsZShpc1Byb2QpO1xuICAgIC8vIEJhc2tldCB0YWJsZVxuICAgIHRoaXMuYmFza2V0VGFibGUgPSB0aGlzLmNyZWF0ZUJhc2tldFRhYmxlKGlzUHJvZCk7XG4gICAgLy8gT3JkZXIgdGFibGVcbiAgICB0aGlzLm9yZGVyVGFibGUgPSB0aGlzLmNyZWF0ZU9yZGVyVGFibGUoaXNQcm9kKTtcbiAgfVxuXG4gIC8vIFByb2R1Y3QgRHluYW1vRGIgVGFibGUgQ3JlYXRpb25cbiAgLy8gcHJvZHVjdCA6IFBLOiBpZCAtLSBuYW1lIC0gZGVzY3JpcHRpb24gLSBpbWFnZUZpbGUgLSBwcmljZSAtIGNhdGVnb3J5XG4gIHByaXZhdGUgY3JlYXRlUHJvZHVjdFRhYmxlKGlzUHJvZDogYm9vbGVhbik6IElUYWJsZSB7XG4gICAgY29uc3QgcHJvZHVjdFRhYmxlID0gbmV3IFRhYmxlKHRoaXMsICdwcm9kdWN0Jywge1xuICAgICAgcGFydGl0aW9uS2V5OiB7XG4gICAgICAgIG5hbWU6ICdpZCcsXG4gICAgICAgIHR5cGU6IEF0dHJpYnV0ZVR5cGUuU1RSSU5HXG4gICAgICB9LFxuICAgICAgdGFibGVOYW1lOiAncHJvZHVjdCcsXG4gICAgICByZW1vdmFsUG9saWN5OiBpc1Byb2QgPyBSZW1vdmFsUG9saWN5LlJFVEFJTiA6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGJpbGxpbmdNb2RlOiBCaWxsaW5nTW9kZS5QQVlfUEVSX1JFUVVFU1QsXG4gICAgICBlbmNyeXB0aW9uOiBUYWJsZUVuY3J5cHRpb24uQVdTX01BTkFHRUQsXG4gICAgICBwb2ludEluVGltZVJlY292ZXJ5OiBpc1Byb2QsXG4gICAgICBkZWxldGlvblByb3RlY3Rpb246IGlzUHJvZCxcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvZHVjdFRhYmxlO1xuICB9XG5cbiAgLy8gQmFza2V0IER5bmFtb0RiIFRhYmxlIENyZWF0aW9uXG4gIC8vIGJhc2tldCA6IFBLOiB1c2VyTmFtZSAtLSBpdGVtcyAoU0VULU1BUCBvYmplY3QpIFxuICAvLyBpdGVtMSAtIHsgcXVhbnRpdHkgLSBjb2xvciAtIHByaWNlIC0gcHJvZHVjdElkIC0gcHJvZHVjdE5hbWUgfVxuICAvLyBpdGVtMiAtIHsgcXVhbnRpdHkgLSBjb2xvciAtIHByaWNlIC0gcHJvZHVjdElkIC0gcHJvZHVjdE5hbWUgfVxuICBwcml2YXRlIGNyZWF0ZUJhc2tldFRhYmxlKGlzUHJvZDogYm9vbGVhbik6IElUYWJsZSB7XG4gICAgY29uc3QgYmFza2V0VGFibGUgPSBuZXcgVGFibGUodGhpcywgJ2Jhc2tldCcsIHtcbiAgICAgIHBhcnRpdGlvbktleToge1xuICAgICAgICBuYW1lOiAndXNlck5hbWUnLFxuICAgICAgICB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklORyxcbiAgICAgIH0sXG4gICAgICB0YWJsZU5hbWU6ICdiYXNrZXQnLFxuICAgICAgcmVtb3ZhbFBvbGljeTogaXNQcm9kID8gUmVtb3ZhbFBvbGljeS5SRVRBSU4gOiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBiaWxsaW5nTW9kZTogQmlsbGluZ01vZGUuUEFZX1BFUl9SRVFVRVNULFxuICAgICAgZW5jcnlwdGlvbjogVGFibGVFbmNyeXB0aW9uLkFXU19NQU5BR0VELFxuICAgICAgcG9pbnRJblRpbWVSZWNvdmVyeTogaXNQcm9kLFxuICAgICAgZGVsZXRpb25Qcm90ZWN0aW9uOiBpc1Byb2QsXG4gICAgfSk7XG4gICAgcmV0dXJuIGJhc2tldFRhYmxlO1xuICB9XG5cbiAgLy8gT3JkZXIgRHluYW1vRGIgVGFibGUgQ3JlYXRpb25cbiAgLy8gb3JkZXIgOiBQSzogdXNlck5hbWUgLSBTSzogb3JkZXJEYXRlIC0tIHRvdGFsUHJpY2UgLSBmaXJzdE5hbWUgLSBsYXN0TmFtZSAtIGVtYWlsIC0gYWRkcmVzcyAtIHBheW1lbnRNZXRob2QgLSBjYXJkSW5mb1xuICBwcml2YXRlIGNyZWF0ZU9yZGVyVGFibGUoaXNQcm9kOiBib29sZWFuKTogSVRhYmxlIHtcbiAgICBjb25zdCBvcmRlclRhYmxlID0gbmV3IFRhYmxlKHRoaXMsICdvcmRlcicsIHtcbiAgICAgIHBhcnRpdGlvbktleToge1xuICAgICAgICBuYW1lOiAndXNlck5hbWUnLFxuICAgICAgICB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklORyxcbiAgICAgIH0sXG4gICAgICBzb3J0S2V5OiB7XG4gICAgICAgIG5hbWU6ICdvcmRlckRhdGUnLFxuICAgICAgICB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklORyxcbiAgICAgIH0sXG4gICAgICB0YWJsZU5hbWU6ICdvcmRlcicsXG4gICAgICByZW1vdmFsUG9saWN5OiBpc1Byb2QgPyBSZW1vdmFsUG9saWN5LlJFVEFJTiA6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGJpbGxpbmdNb2RlOiBCaWxsaW5nTW9kZS5QQVlfUEVSX1JFUVVFU1QsXG4gICAgICBlbmNyeXB0aW9uOiBUYWJsZUVuY3J5cHRpb24uQVdTX01BTkFHRUQsXG4gICAgICBwb2ludEluVGltZVJlY292ZXJ5OiBpc1Byb2QsXG4gICAgICBkZWxldGlvblByb3RlY3Rpb246IGlzUHJvZCxcbiAgICB9KTtcbiAgICByZXR1cm4gb3JkZXJUYWJsZTtcbiAgfVxufSJdfQ==