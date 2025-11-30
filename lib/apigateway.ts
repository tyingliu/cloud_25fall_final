import { LambdaRestApi, Cors } from "aws-cdk-lib/aws-apigateway";  // ← Add Cors import
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export interface SwnApiGatewayProps {
    productMicroservice: IFunction;
    basketMicroservice: IFunction;
    orderingMicroservices: IFunction;
    environment?: string;
    stageName?: string;
}

export class SwnApiGateway extends Construct {

    public readonly apiUrl: string;

    constructor(scope: Construct, id: string, props: SwnApiGatewayProps) {
        super(scope, id);

        const environment = props.environment || 'dev';
        const stageName = props.stageName || 'prod';

        this.createProductApi(props.productMicroservice, stageName);
        this.createBasketApi(props.basketMicroservice, stageName);
        const orderApi = this.createOrderApi(props.orderingMicroservices, stageName);

        this.apiUrl = orderApi.url;
    }

    private createProductApi(productMicroservice: IFunction, stageName: string) {
        const apigw = new LambdaRestApi(this, 'productApi', {
            restApiName: 'Product Service',
            description: 'Product microservice REST API',
            handler: productMicroservice,
            proxy: false,
            deployOptions: {
                stageName: stageName,
                throttlingRateLimit: 100,
                throttlingBurstLimit: 200
            },
            // ← ADD CORS HERE
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS,
                allowHeaders: [
                    'Content-Type',
                    'X-Amz-Date',
                    'Authorization',
                    'X-Api-Key',
                    'X-Amz-Security-Token'
                ]
            }
        });

        const product = apigw.root.addResource('product');
        product.addMethod('GET');
        product.addMethod('POST');

        const singleProduct = product.addResource('{id}');
        singleProduct.addMethod('GET');
        singleProduct.addMethod('PUT');
        singleProduct.addMethod('DELETE');
    }

    private createBasketApi(basketMicroservice: IFunction, stageName: string) {
        const apigw = new LambdaRestApi(this, 'basketApi', {
            restApiName: 'Basket Service',
            description: 'Basket microservice REST API',
            handler: basketMicroservice,
            proxy: false,
            deployOptions: {
                stageName: stageName,
                throttlingRateLimit: 100,
                throttlingBurstLimit: 200
            },
            // ← ADD CORS HERE TOO
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS,
                allowHeaders: [
                    'Content-Type',
                    'X-Amz-Date',
                    'Authorization',
                    'X-Api-Key',
                    'X-Amz-Security-Token'
                ]
            }
        });

        const basket = apigw.root.addResource('basket');
        basket.addMethod('GET');
        basket.addMethod('POST');

        const singleBasket = basket.addResource('{userName}');
        singleBasket.addMethod('GET');
        singleBasket.addMethod('DELETE');

        const basketCheckout = basket.addResource('checkout');
        basketCheckout.addMethod('POST');
    }

    private createOrderApi(orderingMicroservices: IFunction, stageName: string): LambdaRestApi {
        const apigw = new LambdaRestApi(this, 'orderApi', {
            restApiName: 'Order Service',
            description: 'Order microservice REST API',
            handler: orderingMicroservices,
            proxy: false,
            deployOptions: {
                stageName: stageName,
                throttlingRateLimit: 100,
                throttlingBurstLimit: 200
            },
            // ← ADD CORS HERE TOO
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS,
                allowHeaders: [
                    'Content-Type',
                    'X-Amz-Date',
                    'Authorization',
                    'X-Api-Key',
                    'X-Amz-Security-Token'
                ]
            }
        });

        const order = apigw.root.addResource('order');
        order.addMethod('GET');

        const singleOrder = order.addResource('{userName}');
        singleOrder.addMethod('GET');

        return apigw;
    }
}