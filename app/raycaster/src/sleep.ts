

import { assertIsPositiveInteger } from './utils/utils';

const ONE_SECOND_IN_MS = 1000

async function sleep(fps: number): Promise<void> {
	/** precondition: fps must be a positive integer
	* postcondition: suspends execution for the duration of one frame at the specified fps
	*/
	assertIsPositiveInteger(fps)
	let framerate = Math.floor(ONE_SECOND_IN_MS / fps);
	if (framerate === 0) {
		framerate = 1;
	}
	await timeout(framerate)
}

/**
 * Delays execution for a set amount of seconds
 * * **/
async function delayFor(seconds: number): Promise<void> {
	// if the entry is invalid, then default to 1 second
	try {
		assertIsPositiveInteger(seconds)
	} catch (error) {
		seconds = 1
	}
	// if the entry is invalid, then default to 1 second
	// convert seconds to miliseconds
	const milliseconds = seconds * ONE_SECOND_IN_MS
	// pass milliseconds to the timeout wrapper
	await timeout(milliseconds)
}

/**
 * suspends execution for specified amount of milliseconds
 * (wrapper method for callback-heavy built-ins)
**/
async function timeout(milliseconds: number): Promise<void> {
	// assert  milliseconds is a valid entry
	assertIsPositiveInteger(milliseconds);
	// call JS timeout function
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export { sleep, delayFor }


