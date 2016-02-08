/// <reference path="IRenderable.ts" />

class Particle implements IRenderable {
	private static degrees = Math.PI / 180;
	private xPosition: number;
	private yPosition: number;
	private width: number;
	private height: number;
	public rotation: number;
	private color: string;
	private opacity: number;
	private get centerXPosition(): number {
		return this.xPosition + (this.width / 2);
	}
	private get centerYPosition(): number {
		return this.yPosition + (this.height / 2);
	}
	public isAlive: boolean;
	
	public constructor(
		xPosition: number,
		yPosition: number,
		width: number,
		height: number,
		rotation: number,
		color: string,
		opacity: number)
	{
		this.xPosition = xPosition;
		this.yPosition = yPosition;
		this.width = width;
		this.height = height;
		this.rotation = rotation;
		this.color = color;
		this.opacity = opacity;
		this.isAlive = true;
	}

	public Render(renderContext: CanvasRenderingContext2D): IRenderable[] {
		this.opacity -= 0.005;
		if(this.opacity <= 0)
		{
			this.isAlive = false;
		}
		else
		{
			renderContext.save();
			renderContext.globalAlpha = this.opacity;
			
			renderContext.translate(this.centerXPosition, this.centerYPosition);
			renderContext.rotate(this.rotation * Particle.degrees);
			renderContext.translate(-this.centerXPosition, -this.centerYPosition);
			
			renderContext.beginPath();

			renderContext.rect(this.xPosition, this.yPosition, this.width, this.height);

			renderContext.fillStyle = this.color;
			renderContext.fill();

			renderContext.closePath();
			
			renderContext.globalAlpha = 1;
			renderContext.restore();
		}
		
		return [] as IRenderable[];
	}
}