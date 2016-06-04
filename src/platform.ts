import {PhysicsBlock} from "physicsBlock";
import {MovingPoint, Point} from "point";
import {Viewport} from "viewport";
import {Volume} from "volume";
import {Orchestrator} from "entitySystem/orchestrator";
import {RenderComponent, RectangleLayer} from "entitySystem/renderComponent";

export class Platform extends PhysicsBlock {
	private static platformSpeedIncrease: number = 1000;
	private static minimumReboundSpeed: number = 10;

	public viewport: Viewport;

	private get bottomOfScreen(): number {
		return this.viewport.renderDimensions.y - this.viewport.offset;
	}

	private get offscreenAmount(): number {
		return Math.max(this.locationComponent.top - this.bottomOfScreen, 0);
	}

	public constructor(
		worldPosition: MovingPoint,
		dimensions: Point,
		color: string,
		gravity: number,
		volume: Volume,
		worldWidth: number
	) {
		super(worldPosition, dimensions, color, gravity, volume, 10, worldWidth);

		this.collisionComponent.onCollide.push(() => {
			if (this.locationComponent.ySpeed < Platform.minimumReboundSpeed) {
				this.locationComponent.ySpeed = Platform.minimumReboundSpeed;
			}
		});

		this.renderComponent = new RenderComponent(
			this.locationComponent,
			new RectangleLayer(color),
			1,
			1
		);
	}

	public Tick(deltaTime: number): void {
		this.locationComponent.xSpeed =
			this.locationComponent.xSpeed * (
				(Platform.platformSpeedIncrease + deltaTime) / Platform.platformSpeedIncrease);

		super.Tick(deltaTime);
	}

	public Render(renderContext: CanvasRenderingContext2D, orchestrator: Orchestrator): void {
		if (this.offscreenAmount > 0) {
			renderContext.save();

			renderContext.fillStyle = this.fillColor;

			renderContext.globalAlpha = 0.2;
			renderContext.fillRect(
				this.locationComponent.left,
				this.bottomOfScreen - this.locationComponent.height,
				this.locationComponent.width,
				this.locationComponent.height
			);

			renderContext.globalAlpha = 1;
			renderContext.fillRect(
				this.locationComponent.left,
				this.bottomOfScreen - this.locationComponent.height,
				((this.offscreenAmount / 10) % this.locationComponent.width),
				this.locationComponent.height
			);

			renderContext.restore();
		}
	}
}
