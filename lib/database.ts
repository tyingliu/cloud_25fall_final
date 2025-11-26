import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { AttributeType, BillingMode, ITable, Table, TableEncryption } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export interface SwnDatabaseProps {
  /**
   * Environment name (e.g., 'dev', 'prod')
   * @default 'dev'
   */
  readonly environment?: string;
}

export class SwnDatabase extends Construct {

  public readonly productTable: ITable;
  public readonly basketTable: ITable;
  public readonly orderTable: ITable;

  constructor(scope: Construct, id: string, props?: SwnDatabaseProps) {
    super(scope, id);

    const environment = props?.environment || 'dev';
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
  private createProductTable(isProd: boolean): ITable {
    const productTable = new Table(this, 'product', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: 'product',
      removalPolicy: isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: isProd,
      deletionProtection: isProd,
    });
    return productTable;
  }

  // Basket DynamoDb Table Creation
  // basket : PK: userName -- items (SET-MAP object) 
  // item1 - { quantity - color - price - productId - productName }
  // item2 - { quantity - color - price - productId - productName }
  private createBasketTable(isProd: boolean): ITable {
    const basketTable = new Table(this, 'basket', {
      partitionKey: {
        name: 'userName',
        type: AttributeType.STRING,
      },
      tableName: 'basket',
      removalPolicy: isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: isProd,
      deletionProtection: isProd,
    });
    return basketTable;
  }

  // Order DynamoDb Table Creation
  // order : PK: userName - SK: orderDate -- totalPrice - firstName - lastName - email - address - paymentMethod - cardInfo
  private createOrderTable(isProd: boolean): ITable {
    const orderTable = new Table(this, 'order', {
      partitionKey: {
        name: 'userName',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'orderDate',
        type: AttributeType.STRING,
      },
      tableName: 'order',
      removalPolicy: isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: isProd,
      deletionProtection: isProd,
    });
    return orderTable;
  }
}