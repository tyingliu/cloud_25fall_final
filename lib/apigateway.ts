import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export interface SwnApiGatewayProps {
    productMicroservice: IFunction;
    basketMicroservice: IFunction;
    orderingMicroservices: IFunction;
    /**
     * Environment name (e.g., 'dev', 'prod')
     * @default 'dev'
     */
    environment?: string;
    /**
     * Stage name for API Gateway
     * @default 'prod'
     */
    stageName?: string;
}

export class SwnApiGateway extends Construct {

    public readonly apiUrl: string;

    constructor(scope: Construct, id: string, props: SwnApiGatewayProps) {
        super(scope, id);

        const environment = props.environment || 'dev';
        const stageName = props.stageName || 'prod';

        // Product microservices api gateway
        this.createProductApi(props.productMicroservice, stageName);
        // Basket microservices api gateway
        this.createBasketApi(props.basketMicroservice, stageName);
        // Ordering microservices api gateway
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
            }
        });

        const order = apigw.root.addResource('order');
        order.addMethod('GET');

        const singleOrder = order.addResource('{userName}');
        singleOrder.addMethod('GET');

        return apigw;
    }
}