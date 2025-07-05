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
exports.sleep = sleep;
const ONE_SECOND_IN_MS = 100;
function sleep(fps) {
    return __awaiter(this, void 0, void 0, function* () {
        // precondition: fps must be a positive integer
        // postcondition: suspends execution for the duration of one frame at the specified fps
        if (typeof fps !== 'number' || !Number.isInteger(fps) || fps <= 0) {
            throw new Error("FPS must be greater than 0");
        }
        return new Promise((resolve) => setTimeout(resolve, ONE_SECOND_IN_MS / fps));
    });
}
