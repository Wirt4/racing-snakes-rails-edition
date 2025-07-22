import { Game } from './game';
import { GameMapInterface } from '../gamemap/interface';
import { PlayerInterface } from '../player/interface';
import { ContextRendererInterface } from '../renderer/interface';
import { describe, test, expect } from '@jest/globals';
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
	test('if the player has collided with a wall, then its game over for them', () => {
		let map: GameMapInterface = {
			walls: [],
			gridLinesX: [],
			gridLinesY: [],
			playerPosition: { x: 0, y: 0 },
			playerAngle: 0,
			playerTrail: [],
			castRay: mockCastRay,
			resetIntersections: () => { },
			appendWall: (wall: WallInterface) => { }
		}

		let player: PlayerInterface = {} as PlayerInterface;
		let renderer: ContextRendererInterface = {
		} as ContextRendererInterface;
		let brightness: BrightnessInterface = {} as BrightnessInterface;
		let raycaster: RaycasterInterface = {} as RaycasterInterface;
		const game = new Game(map, renderer, raycaster, brightness, false, player)
		expect(game.isGameOver()).toBe(true);
	})
})
