import { describe, test, expect, } from '@jest/globals';
import { Player } from './player'
describe('Player.move())', () => {
	describe('given  a player is at coordinates 5, 5 with an angle of 0 and a speed of 5, when move is called, then the resulting coordinates are 10,5', () => {
		const player = new Player({ x: 5, y: 5 }, 0, 5);
		player.move();
		expect(player.x).toBe(10);
		expect(player.y).toBe(5);
	})
})
