
import { LoopControllerInterface } from './interface';
import { LoopDriverInterface } from '../loopDriver/interface';

class LoopController implements LoopControllerInterface {
	private isRunning: boolean = false;
	constructor(
		private clear: () => void,
		private update: () => void,
		private draw: () => void,
		private driver: LoopDriverInterface) { }

	start(): void {
		if (!this.isRunning) {
			this.driver.start(this.gameTick);
			this.isRunning = true;
		}
	}

	gameTick(): void {
		this.clear();
		this.update();
		this.draw();
	}

	stop(): void {
		this.driver.stop();
	}
}
export { LoopController };
