import { Game } from './game';
import { beforeEach, describe, test, jest, expect } from '@jest/globals';
import { ColorName } from '../color/color_name';
function mockCastRay(angle, distance) {
    return {
        distance: 0,
        color: ColorName.BLUE,
        gridHits: [],
        intersection: { x: 0, y: 0 }
    };
}
describe('isGameOver tests', () => {
    let map;
    let player;
    let renderer;
    let brightness;
    let raycaster;
    let game;
    beforeEach(() => {
        player = {
            hasCollided: (arena) => { return false; },
            x: 0,
            y: 0,
            angle: 0,
            trail: [],
            turnLeft: () => { },
            turnRight: () => { },
            color: ColorName.BLUE,
            move: () => { },
        };
        map = {
            walls: [],
            arena: {
                walls: [],
                gridLines: [],
                containsCoordinates: (x, y) => true,
            },
            player,
            resetIntersections: () => { },
            appendWall: (wall) => { },
        };
        renderer = {
            renderHUD: () => { },
            renderSlices: () => { },
        };
        brightness = {};
        raycaster = {
            fillRaysInto: (rays, angle) => { },
            castRay: (position, angle, walls, gridLines) => null
        };
        game = new Game(map, renderer, raycaster, brightness, player);
    });
    test('if the player has collided with a wall, then its game over for them', () => {
        jest.spyOn(player, 'hasCollided').mockReturnValue(true);
        expect(game.isGameOver()).toBe(true);
    });
});
describe('Draw condition tests', () => {
    let map;
    let player;
    let renderer;
    let brightness;
    let raycaster;
    let game;
    beforeEach(() => {
        map = {
            walls: [],
            arena: {
                containsCoordinates: (x, y) => true,
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
                hasCollided: (arena) => { return false; },
            },
            resetIntersections: () => { },
            appendWall: (wall) => { },
        };
        player = {
            hasCollided: (arena) => { return false; },
        };
        renderer = {
            renderHUD: () => { },
            renderSlices: () => { },
        };
        brightness = {
            calculateBrightness: (distance) => 1,
        };
        raycaster = {
            fillRaysInto: (rays, angle) => { },
            castRay: (position, angle, walls, gridLines) => null,
            removeFishEye: (distance, centerAngle, relativeAngle) => 0,
        };
        game = new Game(map, renderer, raycaster, brightness, player);
    });
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
