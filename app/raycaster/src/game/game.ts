import { GameMapInterface } from '../gamemap/interface';
import { Settings } from '../settings/settings';
import { BatchRendererInterface } from '../batchRenderer/interface';
import { PlayerInterface } from '../player/interface';
import { GameInterface } from './interface';
import { BatchCorrelatorInterface } from '../batchCorrelator/interface';

class Game implements GameInterface {

	constructor(
		public map: GameMapInterface,
		private batchRenderer: BatchRendererInterface,
		private player: PlayerInterface,
		private batchCorrelator: BatchCorrelatorInterface
	) {
	}

	update(): void {
		this.player.move();
	}

	isGameOver(): boolean {
		return this.map.hasCollidedWithWall(this.player);
	};

	draw(
	): void {
		this.map.resetIntersections();
		this.batchCorrelator.batchRenderData();
		this.batchRenderer.batches = this.batchCorrelator.batches;
		if (this.map.hasCollidedWithWall(this.player)) {
			this.batchRenderer.renderHUD();
		} else {
			this.batchRenderer.renderSlices();
		}
	}
}
export { Game };
