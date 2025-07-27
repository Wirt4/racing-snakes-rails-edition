
import { Game } from '../game/game';
import { PlayerInterface } from '../player/interface';
import { BatchRendererInterface } from '../batchRenderer/interface';
import { sleep } from '../sleep';
import { GameFacadeInterface } from './interface';

class GameFacade implements GameFacadeInterface {
	private running = false;

	constructor(
		private readonly game: Game,
		private readonly player: PlayerInterface,
		private readonly batchRenderer: BatchRendererInterface
	) { }

	startLoop(): void {
		if (this.running) return;
		this.running = true;

		const loop = async (): Promise<void> => {
			this.batchRenderer.clear();
			this.game.update();
			this.game.draw();
			await sleep(30);

			if (!this.game.isGameOver()) {
				requestAnimationFrame(loop);
			} else {
				this.running = false;
			}
		};

		requestAnimationFrame(loop);
	}

	turnLeft(): void {
		this.player.turnLeft();
	}

	turnRight(): void {
		this.player.turnRight();
	}
}

export { GameFacade };
