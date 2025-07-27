
import { Game } from '../game/game';
import { Player } from '../player/player';
import { BatchRenderer } from '../batchRenderer/batchRenderer';
import { sleep } from '../sleep';

interface LoopController {
	startLoop(): void;
}

interface PlayerController {
	turnLeft(): void;
	turnRight(): void;
}

class GameFacade implements LoopController, PlayerController {
	private running = false;

	constructor(
		private readonly game: Game,
		private readonly player: Player,
		private readonly batchRenderer: BatchRenderer
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
export { GameFacade, LoopController, PlayerController };
