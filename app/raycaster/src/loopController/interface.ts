interface LoopControllerInterface {
	start: () => void;
	gameTick: () => void;
	stop: () => void;
}

export { LoopControllerInterface };
