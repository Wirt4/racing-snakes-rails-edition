interface LoopDriverInterface {
	start(gameTick: () => void): void;
	stop(): void;
}

export { LoopDriverInterface };
