"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// test for game loop
const sleep_1 = require("./sleep");
const settings_1 = require("./settings");
const renderer_1 = require("./renderer");
const game_map_1 = require("./game-map");
const player_1 = require("./player");
const wall_1 = require("./wall");
const color_1 = require("./color");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const topWall = new wall_1.Wall(1, 1, 58, 1, color_1.Color.GREEN);
        const rightWall = new wall_1.Wall(58, 1, 58, 58, color_1.Color.GREEN);
        const bottomWall = new wall_1.Wall(58, 58, 1, 58, color_1.Color.GREEN);
        const leftWall = new wall_1.Wall(1, 58, 1, 1, color_1.Color.GREEN);
        const walls = [
            topWall,
            new wall_1.Wall(40, 30, 5, 10, color_1.Color.RED),
            new wall_1.Wall(5, 10, 70, 30, color_1.Color.RED),
            rightWall,
            bottomWall,
            leftWall,
        ];
        const player = new player_1.Player(4.5, 4.5, 0);
        const gameMap = new game_map_1.GameMap(player, walls);
        const renderer = new renderer_1.Renderer("app", settings_1.Settings.CANVAS_WIDTH, settings_1.Settings.CANVAS_HEIGHT);
        while (true) {
            renderer.reset();
            gameMap.draw(renderer);
            gameMap.update();
            yield (0, sleep_1.sleep)(settings_1.Settings.FRAMES_PER_SECOND);
        }
    });
}
main().catch((err) => {
    console.error("Error in main loop:", err);
});
