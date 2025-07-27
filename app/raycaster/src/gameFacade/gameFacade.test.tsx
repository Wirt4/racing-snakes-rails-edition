
import { jest, expect, describe, beforeEach, afterEach, test } from '@jest/globals';
import { GameFacade } from './gameFacade';
import { sleep } from '../sleep';

jest.mock('../sleep', () => ({
	sleep: jest.fn(() => Promise.resolve())
}));

async function runTimers() {
	await Promise.resolve();
	jest.runAllTimers();
	await Promise.resolve();
}

describe('GameFacade', () => {
	let mockGame: any;
	let mockPlayer: any;
	let mockRenderer: any;
	let facade: GameFacade;

	beforeEach(() => {
		jest.useFakeTimers();

		if (!global.requestAnimationFrame) {
			global.requestAnimationFrame = (cb: FrameRequestCallback): number => {
				return setTimeout(() => cb(0), 0) as unknown as number;
			};
		}
		jest.spyOn(global, 'requestAnimationFrame').mockImplementation((cb) => {
			setTimeout(() => cb(0), 0);
			return 0;
		});

		mockGame = {
			update: jest.fn(),
			draw: jest.fn(),
			isGameOver: jest.fn().mockReturnValue(false),
		};

		mockPlayer = {
			turnLeft: jest.fn(),
			turnRight: jest.fn(),
		};

		mockRenderer = {
			clear: jest.fn(),
		};

		facade = new GameFacade(mockGame, mockPlayer, mockRenderer);
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.useRealTimers();
	});

	test('calls renderer.clear, game.update, and game.draw in the loop', async () => {
		mockGame.isGameOver.mockReturnValueOnce(false).mockReturnValueOnce(true);

		facade.startLoop();
		await runTimers();

		expect(mockRenderer.clear).toHaveBeenCalled();
		expect(mockGame.update).toHaveBeenCalled();
		expect(mockGame.draw).toHaveBeenCalled();
		expect(mockGame.isGameOver).toHaveBeenCalled();
	});

	test('does not restart the loop if already running', () => {
		facade['running'] = true; // manually force running
		facade.startLoop();

		expect(mockRenderer.clear).not.toHaveBeenCalled();
		expect(mockGame.update).not.toHaveBeenCalled();
		expect(mockGame.draw).not.toHaveBeenCalled();
	});

	test('stops the loop when game is over', async () => {
		mockGame.isGameOver.mockReturnValueOnce(true);

		facade.startLoop();
		await runTimers();

		expect(mockGame.isGameOver).toHaveBeenCalled();
	});

	test('calls player.turnLeft', () => {
		facade.turnLeft();
		expect(mockPlayer.turnLeft).toHaveBeenCalled();
	});

	test('calls player.turnRight', () => {
		facade.turnRight();
		expect(mockPlayer.turnRight).toHaveBeenCalled();
	});
});
