import { Listener } from './listener';
import { beforeEach, describe, test, expect, jest } from '@jest/globals';
import { Directions } from '../controls/directions';
describe('Keydown Tests', () => {
    let mockWorker;
    let listener;
    let postMessageSpy;
    beforeEach(() => {
        mockWorker = { postMessage: jest.fn() };
        listener = new Listener(mockWorker);
        postMessageSpy = jest.spyOn(mockWorker, 'postMessage');
        ;
    });
    test('should turn left', () => {
        const keyStroke = 'ArrowLeft';
        listener.keydown(keyStroke);
        expect(mockWorker.postMessage).toHaveBeenCalledWith({
            type: 'turn',
            direction: Directions.LEFT
        });
    });
    test('if user hits the same key twice, just call the worker post once', () => {
        const keyStroke = 'ArrowLeft';
        listener.keydown(keyStroke);
        listener.keydown(keyStroke);
        expect(postMessageSpy.mock.calls).toEqual([
            [{ type: 'turn', direction: Directions.LEFT }]
        ]);
    });
    test('should turn right', () => {
        const keyStroke = 'ArrowRight';
        listener.keydown(keyStroke);
        expect(mockWorker.postMessage).toHaveBeenCalledWith({
            type: 'turn',
            direction: Directions.RIGHT
        });
    });
    test('should turn right after turning left', () => {
        listener.keydown('ArrowLeft');
        listener.keydown('ArrowRight');
        expect(postMessageSpy.mock.calls).toEqual([
            [{ type: 'turn', direction: Directions.LEFT }],
            [{ type: 'turn', direction: Directions.RIGHT }]
        ]);
    });
    test('should not turn if the same key is pressed twice', () => {
        listener.keydown('ArrowLeft');
        listener.keydown('ArrowLeft');
        expect(postMessageSpy.mock.calls).toEqual([
            [{ type: 'turn', direction: Directions.LEFT }]
        ]);
    });
    test('shoult not accept any keys other than ArrowLeft or ArrowRight', () => {
        listener.keydown('a');
        expect(mockWorker.postMessage).not.toHaveBeenCalled();
    });
    test('can turn left again after releasing arrow left key', () => {
        const keyStroke = 'ArrowLeft';
        listener.keydown(keyStroke);
        listener.keyup(keyStroke);
        listener.keydown(keyStroke);
        expect(mockWorker.postMessage).toHaveBeenCalledTimes(2);
    });
    test('the keyups need to match', () => {
        listener.keydown('ArrowLeft');
        listener.keyup('ArrowRight');
        listener.keydown('ArrowLeft');
        expect(mockWorker.postMessage).toHaveBeenCalledTimes(1);
    });
});
