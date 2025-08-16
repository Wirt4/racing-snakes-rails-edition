import { describe, test, jest, expect, beforeEach } from '@jest/globals';
import { GameMap } from './map';
import { ColorName } from '../color/color_name';
class MockPlayer {
    constructor(pos, angle, trail) {
        this.color = ColorName.RED;
        this.hasCollided = () => false;
        this.x = pos.x;
        this.y = pos.y;
        this.angle = angle;
        this.trail = trail;
    }
    move() { }
    turnLeft() { }
    turnRight() { }
}
describe('GameMap configuration options', () => {
    test('walls should be configurable by color', () => {
        const arena = { gridLines: [], walls: [], containsCoordinates: () => true };
        const gameMap = new GameMap(arena, new MockPlayer({ x: 1, y: 1 }, 0, []));
        gameMap.walls.forEach(wall => {
            expect(wall.color).toBe(ColorName.RED);
        });
    });
});
describe("Player tests", () => {
    let player;
    let arena;
    beforeEach(() => {
        player = {
            turnLeft: jest.fn(() => { }), turnRight: jest.fn(), move: jest.fn(() => { }), x: 1, y: 1, angle: 0, color: ColorName.GREEN,
            trail: [],
            hasCollided: jest.fn(() => false)
        };
        arena = { walls: [], gridLines: [], containsCoordinates: () => true };
    });
    test("angle should be passed to player class", () => {
        const gameMap = new GameMap(arena, player);
        gameMap.turnPlayer(Math.PI / 2);
        expect(player.turnLeft).toHaveBeenLastCalledWith();
    });
    test("movePlayer should call player.move", () => {
        const gameMap = new GameMap(arena, player);
        gameMap.movePlayer();
        expect(player.move).toHaveBeenCalled();
    });
});
