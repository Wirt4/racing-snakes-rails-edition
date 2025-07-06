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
const renderer_1 = require("./renderer"); // Uncomment if using Renderer class
const game_map_1 = require("./game-map");
// function writeText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number): void {
// 	ctx.fillStyle = "#FFFFFF"; //white
// 	ctx.font = "16px Arial";
// 	ctx.fillText(text, x, y);
// }
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const renderer = new renderer_1.Renderer("app", settings_1.Settings.CANVAS_WIDTH, settings_1.Settings.CANVAS_HEIGHT);
        const gameMap = new game_map_1.GameMap();
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
