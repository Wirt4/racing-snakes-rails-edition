import { Game } from './game';
import { GameMapInterface } from '../gamemap/interface';
import { PlayerInterface } from '../player/interface';
import { ContextRendererInterface } from '../renderer/interface';
import { beforeEach, describe, test, jest, expect } from '@jest/globals';
import { BrightnessInterface } from '../brightness/interface';
import { RaycasterInterface } from '../raycaster/interface';
import { WallInterface } from '../gamemap/interface';
import { ColorName } from '../color/color_name';

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
	let renderer: ContextRendererInterface
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
		} as ContextRendererInterface;
		brightness = {} as BrightnessInterface;
		raycaster = {} as RaycasterInterface;
		game = new Game(map, renderer, raycaster, brightness, false, player)

	})
	test('if the player has collided with a wall, then its game over for them', () => {
		expect(game.isGameOver()).toBe(true);
	})
})
