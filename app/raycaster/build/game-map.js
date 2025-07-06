"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMap = void 0;
class GameMap {
    // for all the coordinates of walls and trails and stuff
    // player: Player
    // walls: Wall[]
    // constructor(player: Player, walls: Wall[]) {
    // 	this.player = player;
    // 	this.walls = walls;
    // }
    draw(renderer) {
        renderer.draw();
    }
    update() {
        // Update game state, e.g., player position, wall states, etc.
        // This method can be expanded based on game logic
    }
}
exports.GameMap = GameMap;
