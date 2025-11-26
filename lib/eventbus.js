"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwnEventBus = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_events_1 = require("aws-cdk-lib/aws-events");
const aws_events_targets_1 = require("aws-cdk-lib/aws-events-targets");
const constructs_1 = require("constructs");
class SwnEventBus extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const environment = props.environment || 'dev';
        const isProd = environment === 'prod';
        // Event bus
        this.eventBus = new aws_events_1.EventBus(this, 'SwnEventBus', {
            eventBusName: 'SwnEventBus'
        });
        // Archive for event replay (useful for debugging and disaster recovery)
        const archive = new aws_events_1.Archive(this, 'SwnEventArchive', {
            sourceEventBus: this.eventBus,
            archiveName: 'SwnEventArchive',
            description: 'Archive for SWN EventBus events',
            retention: isProd ? aws_cdk_lib_1.Duration.days(30) : aws_cdk_lib_1.Duration.days(7),
            eventPattern: {
                source: ['com.swn.basket.checkoutbasket']
            }
        });
        // Checkout basket rule
        this.checkoutBasketRule = new aws_events_1.Rule(this, 'CheckoutBasketRule', {
            eventBus: this.eventBus,
            enabled: true,
            description: 'When Basket microservice checkout the basket',
            eventPattern: {
                source: ['com.swn.basket.checkoutbasket'],
                detailType: ['CheckoutBasket']
            },
            ruleName: 'CheckoutBasketRule'
        });
        // Add SQS queue as target with dead letter queue handling
        this.checkoutBasketRule.addTarget(new aws_events_targets_1.SqsQueue(props.targetQueue, {
            // Retry configuration
            maxEventAge: aws_cdk_lib_1.Duration.hours(24),
            retryAttempts: 3,
            // Message will be sent to queue with event details
        }));
        this.checkoutBasketRule.addTarget(new aws_events_targets_1.SqsQueue(props.inventoryQueue, {
            maxEventAge: aws_cdk_lib_1.Duration.hours(24),
            retryAttempts: 3,
        }));
        // Grant permissions to publisher function
        this.eventBus.grantPutEventsTo(props.publisherFunction);
    }
}
exports.SwnEventBus = SwnEventBus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRidXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJldmVudGJ1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBc0Q7QUFDdEQsdURBQWlFO0FBQ2pFLHVFQUEwRDtBQUcxRCwyQ0FBdUM7QUFhdkMsTUFBYSxXQUFZLFNBQVEsc0JBQVM7SUFLdEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF1QjtRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLElBQUksS0FBSyxDQUFDO1FBQy9DLE1BQU0sTUFBTSxHQUFHLFdBQVcsS0FBSyxNQUFNLENBQUM7UUFFdEMsWUFBWTtRQUNaLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxxQkFBUSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDOUMsWUFBWSxFQUFFLGFBQWE7U0FDOUIsQ0FBQyxDQUFDO1FBRUgsd0VBQXdFO1FBQ3hFLE1BQU0sT0FBTyxHQUFHLElBQUksb0JBQU8sQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDakQsY0FBYyxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQzdCLFdBQVcsRUFBRSxpQkFBaUI7WUFDOUIsV0FBVyxFQUFFLGlDQUFpQztZQUM5QyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxzQkFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3hELFlBQVksRUFBRTtnQkFDVixNQUFNLEVBQUUsQ0FBQywrQkFBK0IsQ0FBQzthQUM1QztTQUNKLENBQUMsQ0FBQztRQUVILHVCQUF1QjtRQUN2QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxpQkFBSSxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRTtZQUMzRCxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsT0FBTyxFQUFFLElBQUk7WUFDYixXQUFXLEVBQUUsOENBQThDO1lBQzNELFlBQVksRUFBRTtnQkFDVixNQUFNLEVBQUUsQ0FBQywrQkFBK0IsQ0FBQztnQkFDekMsVUFBVSxFQUFFLENBQUMsZ0JBQWdCLENBQUM7YUFDakM7WUFDRCxRQUFRLEVBQUUsb0JBQW9CO1NBQ2pDLENBQUMsQ0FBQztRQUVILDBEQUEwRDtRQUMxRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLElBQUksNkJBQVEsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFO1lBQzlELHNCQUFzQjtZQUN0QixXQUFXLEVBQUUsc0JBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQy9CLGFBQWEsRUFBRSxDQUFDO1lBQ2hCLG1EQUFtRDtTQUN0RCxDQUFDLENBQUMsQ0FBQztRQUVKLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsSUFBSSw2QkFBUSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUU7WUFDakUsV0FBVyxFQUFFLHNCQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUMvQixhQUFhLEVBQUUsQ0FBQztTQUNuQixDQUFDLENBQUMsQ0FBQztRQUVKLDBDQUEwQztRQUMxQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzVELENBQUM7Q0FDSjtBQXZERCxrQ0F1REMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEdXJhdGlvbiwgUmVtb3ZhbFBvbGljeSB9IGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgRXZlbnRCdXMsIFJ1bGUsIEFyY2hpdmUgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWV2ZW50c1wiO1xuaW1wb3J0IHsgU3FzUXVldWUgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWV2ZW50cy10YXJnZXRzXCI7XG5pbXBvcnQgeyBJRnVuY3Rpb24gfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxhbWJkYVwiO1xuaW1wb3J0IHsgSVF1ZXVlIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1zcXNcIjtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3duRXZlbnRCdXNQcm9wcyB7XG4gICAgcHVibGlzaGVyRnVuY3Rpb246IElGdW5jdGlvbjtcbiAgICB0YXJnZXRRdWV1ZTogSVF1ZXVlO1xuICAgIGludmVudG9yeVF1ZXVlOiBJUXVldWU7XG4gICAgLyoqXG4gICAgICogRW52aXJvbm1lbnQgbmFtZSAoZS5nLiwgJ2RldicsICdwcm9kJylcbiAgICAgKiBAZGVmYXVsdCAnZGV2J1xuICAgICAqL1xuICAgIGVudmlyb25tZW50Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgU3duRXZlbnRCdXMgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gICAgcHVibGljIHJlYWRvbmx5IGV2ZW50QnVzOiBFdmVudEJ1cztcbiAgICBwdWJsaWMgcmVhZG9ubHkgY2hlY2tvdXRCYXNrZXRSdWxlOiBSdWxlO1xuXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFN3bkV2ZW50QnVzUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgICAgICBjb25zdCBlbnZpcm9ubWVudCA9IHByb3BzLmVudmlyb25tZW50IHx8ICdkZXYnO1xuICAgICAgICBjb25zdCBpc1Byb2QgPSBlbnZpcm9ubWVudCA9PT0gJ3Byb2QnO1xuXG4gICAgICAgIC8vIEV2ZW50IGJ1c1xuICAgICAgICB0aGlzLmV2ZW50QnVzID0gbmV3IEV2ZW50QnVzKHRoaXMsICdTd25FdmVudEJ1cycsIHtcbiAgICAgICAgICAgIGV2ZW50QnVzTmFtZTogJ1N3bkV2ZW50QnVzJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBcmNoaXZlIGZvciBldmVudCByZXBsYXkgKHVzZWZ1bCBmb3IgZGVidWdnaW5nIGFuZCBkaXNhc3RlciByZWNvdmVyeSlcbiAgICAgICAgY29uc3QgYXJjaGl2ZSA9IG5ldyBBcmNoaXZlKHRoaXMsICdTd25FdmVudEFyY2hpdmUnLCB7XG4gICAgICAgICAgICBzb3VyY2VFdmVudEJ1czogdGhpcy5ldmVudEJ1cyxcbiAgICAgICAgICAgIGFyY2hpdmVOYW1lOiAnU3duRXZlbnRBcmNoaXZlJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQXJjaGl2ZSBmb3IgU1dOIEV2ZW50QnVzIGV2ZW50cycsXG4gICAgICAgICAgICByZXRlbnRpb246IGlzUHJvZCA/IER1cmF0aW9uLmRheXMoMzApIDogRHVyYXRpb24uZGF5cyg3KSxcbiAgICAgICAgICAgIGV2ZW50UGF0dGVybjoge1xuICAgICAgICAgICAgICAgIHNvdXJjZTogWydjb20uc3duLmJhc2tldC5jaGVja291dGJhc2tldCddXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIENoZWNrb3V0IGJhc2tldCBydWxlXG4gICAgICAgIHRoaXMuY2hlY2tvdXRCYXNrZXRSdWxlID0gbmV3IFJ1bGUodGhpcywgJ0NoZWNrb3V0QmFza2V0UnVsZScsIHtcbiAgICAgICAgICAgIGV2ZW50QnVzOiB0aGlzLmV2ZW50QnVzLFxuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnV2hlbiBCYXNrZXQgbWljcm9zZXJ2aWNlIGNoZWNrb3V0IHRoZSBiYXNrZXQnLFxuICAgICAgICAgICAgZXZlbnRQYXR0ZXJuOiB7XG4gICAgICAgICAgICAgICAgc291cmNlOiBbJ2NvbS5zd24uYmFza2V0LmNoZWNrb3V0YmFza2V0J10sXG4gICAgICAgICAgICAgICAgZGV0YWlsVHlwZTogWydDaGVja291dEJhc2tldCddXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcnVsZU5hbWU6ICdDaGVja291dEJhc2tldFJ1bGUnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEFkZCBTUVMgcXVldWUgYXMgdGFyZ2V0IHdpdGggZGVhZCBsZXR0ZXIgcXVldWUgaGFuZGxpbmdcbiAgICAgICAgdGhpcy5jaGVja291dEJhc2tldFJ1bGUuYWRkVGFyZ2V0KG5ldyBTcXNRdWV1ZShwcm9wcy50YXJnZXRRdWV1ZSwge1xuICAgICAgICAgICAgLy8gUmV0cnkgY29uZmlndXJhdGlvblxuICAgICAgICAgICAgbWF4RXZlbnRBZ2U6IER1cmF0aW9uLmhvdXJzKDI0KSxcbiAgICAgICAgICAgIHJldHJ5QXR0ZW1wdHM6IDMsXG4gICAgICAgICAgICAvLyBNZXNzYWdlIHdpbGwgYmUgc2VudCB0byBxdWV1ZSB3aXRoIGV2ZW50IGRldGFpbHNcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHRoaXMuY2hlY2tvdXRCYXNrZXRSdWxlLmFkZFRhcmdldChuZXcgU3FzUXVldWUocHJvcHMuaW52ZW50b3J5UXVldWUsIHtcbiAgICAgICAgICAgIG1heEV2ZW50QWdlOiBEdXJhdGlvbi5ob3VycygyNCksXG4gICAgICAgICAgICByZXRyeUF0dGVtcHRzOiAzLFxuICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8gR3JhbnQgcGVybWlzc2lvbnMgdG8gcHVibGlzaGVyIGZ1bmN0aW9uXG4gICAgICAgIHRoaXMuZXZlbnRCdXMuZ3JhbnRQdXRFdmVudHNUbyhwcm9wcy5wdWJsaXNoZXJGdW5jdGlvbik7XG4gICAgfVxufSJdfQ==