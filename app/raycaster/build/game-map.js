"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMap = void 0;
class GameMap {
    constructor(player, walls) {
        this.player = player;
        this.walls = walls;
    }
    draw(renderer) {
        renderer.draw();
    }
    update() {
        // Update game state, e.g., player position, wall states, etc.
        // This method can be expanded based on game logic
    }
}
exports.GameMap = GameMap;
