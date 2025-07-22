import { LoopDriverInterface } from './interface';

class LoopDriver implements LoopDriverInterface {

	private intervalId: NodeJS.Timeout = setTimeout(() => { }, 1);
	private isRunning: boolean = false;

	constructor(private delay: number) { }

	start(gameTick: () => void): void {
		if (!this.isRunning) {
			this.intervalId = setInterval(gameTick, this.delay)
			this.isRunning = true;
		}
	}

	stop(): void {
		if (this.isRunning) {
			clearInterval(this.intervalId);
			this.isRunning = false;
		}
	}
}

export { LoopDriver }
