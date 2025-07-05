const ONE_SECOND_IN_MS = 100

export async function sleep(fps: number): Promise<void> {
	// precondition: fps must be a positive integer
	// postcondition: suspends execution for the duration of one frame at the specified fps
	if (typeof fps !== 'number' || !Number.isInteger(fps) || fps <= 0) {
		throw new Error("FPS must be greater than 0");
	}
	return new Promise((resolve) => setTimeout(resolve, ONE_SECOND_IN_MS / fps));
}


