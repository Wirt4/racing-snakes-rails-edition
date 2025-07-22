import { Game } from './game';
import { GameMapInterface } from '../gamemap/interface';
import { PlayerInterface } from '../player/interface';
import { beforeEach, describe, test, jest, expect } from '@jest/globals';
import { BrightnessInterface } from '../brightness/interface';
import { RaycasterInterface } from '../raycaster/interface';
import { WallInterface } from '../gamemap/interface';
import { ColorName } from '../color/color_name';
import { BatchRendererInterface } from '../batchRenderer/interface';

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
		map = {
			walls: [],
			gridLinesX: [],
			gridLinesY: [],
			playerPosition: { x: 0, y: 0 },
			playerAngle: 0,
			playerTrail: [],
			castRay: mockCastRay,
			resetIntersections: () => { },
			appendWall: (wall: WallInterface) => { },
			hasCollidedWithWall: () => false
		}

		player = {} as PlayerInterface;
		renderer = {
			renderHUD: () => { },
			renderSlices: () => { },
		} as BatchRendererInterface;
		brightness = {} as BrightnessInterface;
		raycaster = {
			fillRaysInto: (rays: any, angle: any) => { }
		} as RaycasterInterface;
		game = new Game(map, renderer, raycaster, brightness, player)

	})
	test('if the player has collided with a wall, then its game over for them', () => {
		jest.spyOn(map, 'hasCollidedWithWall').mockReturnValue(true);
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
			gridLinesX: [],
			gridLinesY: [],
			playerPosition: { x: 0, y: 0 },
			playerAngle: 0,
			playerTrail: [],
			castRay: mockCastRay,
			resetIntersections: () => { },
			appendWall: (wall: WallInterface) => { },
			hasCollidedWithWall: () => false
		}

		player = {} as PlayerInterface;
		renderer = {
			renderHUD: () => { },
			renderSlices: () => { },
		} as BatchRendererInterface;

		brightness = {
			calculateBrightness: (distance: any) => 1,
		} as BrightnessInterface;
		raycaster = {
			fillRaysInto: (rays: any, angle: any) => { },
			removeFishEye: (distance: number, centerAngle: number, relativeAngle: number) => 0,
		} as RaycasterInterface;

		game = new Game(map, renderer, raycaster, brightness, player)

	})

	test('if the game is not over, then the HUD should not draw', () => {
		jest.spyOn(map, 'hasCollidedWithWall').mockReturnValue(false);
		const spy = jest.spyOn(renderer, 'renderHUD');

		game.draw();
		expect(spy).not.toHaveBeenCalled();
	});

	test('if the game is not over, then the HUD should display', () => {
		jest.spyOn(map, 'hasCollidedWithWall').mockReturnValue(true);
		const spy = jest.spyOn(renderer, 'renderHUD');

		game.draw();
		expect(spy).toHaveBeenCalled();
	});

})
