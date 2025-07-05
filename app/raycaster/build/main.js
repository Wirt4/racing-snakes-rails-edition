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
const canvas_sketch_1 = require("./canvas_sketch");
const sleep_1 = require("./sleep");
const settings_1 = require("./settings");
function draw(ctx) {
    ctx.fillStyle = "#AAFF00"; // a nice green
    ctx.fillRect(130, 190, 40, 60);
    ctx.fillStyle = "#000000"; // black
    ctx.fillText("Hello World", 10, 20);
}
function writeText(ctx, text, x, y) {
    ctx.fillStyle = "#FFFFFF"; //white
    ctx.font = "16px Arial";
    ctx.fillText(text, x, y);
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = (0, canvas_sketch_1.setUpCanvas)("app", 300, 300);
        let frameCount = 0;
        while (true) {
            ctx.reset();
            draw(ctx);
            writeText(ctx, "Frames: " + frameCount, 10, 40);
            yield (0, sleep_1.sleep)(settings_1.Settings.FPS);
            frameCount++;
        }
    });
}
main().catch((err) => {
    console.error("Error in main loop:", err);
});
