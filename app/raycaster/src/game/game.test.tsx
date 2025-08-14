import { Game } from './game';
import { GameMapInterface } from '../gamemap/interface';
import { PlayerInterface } from '../player/interface';
import { beforeEach, describe, test, jest, expect } from '@jest/globals';
import { BrightnessInterface } from '../brightness/interface';
import { RaycasterInterface } from '../raycaster/interface';
import { WallInterface } from '../wall/interface';
import { ColorName } from '../color/color_name';
import { BatchRendererInterface } from '../batchRenderer/interface';
import { LineSegment, Coordinates } from '../geometry/interfaces'

function mockCastRay(angle: number, distance: number) {
	return {
		distance: 0,
		color: ColorName.BLUE,
		gridHits: [],
		intersection: { x: 0, y: 0 }
	};
}

describe('isGameOver tests', () => {
	let map: GameMapInterface
	let player: PlayerInterface
	let renderer: BatchRendererInterface
	let brightness: BrightnessInterface
	let raycaster: RaycasterInterface
	let game: Game

	beforeEach(() => {
		player = {
			hasCollided: (arena: any) => { return false; },
			x: 0,
			y: 0,
			angle: 0,
			trail: [],
			turnLeft: () => { },
			turnRight: () => { },
			color: ColorName.BLUE,
			move: () => { },

		} as PlayerInterface;
		map = {
			walls: [],
			arena: {
				walls: [],
				gridLines: [],
				containsCoordinates: (x: number, y: number) => true,
			},
			player,
			resetIntersections: () => { },
			appendWall: (wall: WallInterface) => { },
		}


		renderer = {
			renderHUD: () => { },
			renderSlices: () => { },
		} as BatchRendererInterface;
		brightness = {} as BrightnessInterface;
		raycaster = {
			fillRaysInto: (rays: any, angle: any) => { },
			castRay: (position: Coordinates, angle: number, walls: WallInterface[], gridLines: Array<LineSegment>) => null
		} as RaycasterInterface;
		game = new Game(map, renderer, raycaster, brightness, player)

	})
	test('if the player has collided with a wall, then its game over for them', () => {
		jest.spyOn(player, 'hasCollided').mockReturnValue(true);
		expect(game.isGameOver()).toBe(true);
	})
})

describe('Draw condition tests', () => {
	let map: GameMapInterface
	let player: PlayerInterface
	let renderer: BatchRendererInterface
	let brightness: BrightnessInterface
	let raycaster: RaycasterInterface
	let game: Game

	beforeEach(() => {
		map = {
			walls: [],
			arena: {
				containsCoordinates: (x: number, y: number) => true,
				walls: [],
				gridLines: [],
			},
			player: {
				x: 0,
				y: 0,
				angle: 0,
				trail: [],
				turnLeft: () => { },
				turnRight: () => { },
				color: ColorName.BLUE,
				move: () => { },
				hasCollided: (arena: any) => { return false; },
			} as PlayerInterface,
			resetIntersections: () => { },
			appendWall: (wall: WallInterface) => { },
		}

		player = {
			hasCollided: (arena: any) => { return false; },
		} as PlayerInterface;
		renderer = {
			renderHUD: () => { },
			renderSlices: () => { },
		} as BatchRendererInterface;

		brightness = {
			calculateBrightness: (distance: any) => 1,
		} as BrightnessInterface;
		raycaster = {
			fillRaysInto: (rays: any, angle: any) => { },
			castRay: (position: Coordinates, angle: number, walls: WallInterface[], gridLines: Array<LineSegment>) => null,
			removeFishEye: (distance: number, centerAngle: number, relativeAngle: number) => 0,
		} as RaycasterInterface;

		game = new Game(map, renderer, raycaster, brightness, player)

	})

	test('if the game is not over, then the HUD should not draw', () => {
		jest.spyOn(player, 'hasCollided').mockReturnValue(false);
		const spy = jest.spyOn(renderer, 'renderHUD');

		game.draw();
		expect(spy).not.toHaveBeenCalled();
	});

	test('if the game is over, then the HUD should display', () => {
		jest.spyOn(player, 'hasCollided').mockReturnValue(true);
		const spy = jest.spyOn(renderer, 'renderHUD');

		game.draw();
		expect(spy).toHaveBeenCalled();
	});

	test('if the game is over, then the slices should not be rendered', () => {
		jest.spyOn(player, 'hasCollided').mockReturnValue(true);
		const spy = jest.spyOn(renderer, 'renderSlices');

		game.draw();
		expect(spy).not.toHaveBeenCalled();
	});

	test('if the game continuting, then the slices should  be rendered', () => {
		jest.spyOn(player, 'hasCollided').mockReturnValue(false);
		const spy = jest.spyOn(renderer, 'renderSlices');
		game.draw();
		expect(spy).toHaveBeenCalled();
	});
});
