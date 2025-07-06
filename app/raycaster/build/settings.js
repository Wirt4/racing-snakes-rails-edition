"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
var Settings;
(function (Settings) {
    Settings[Settings["FRAMES_PER_SECOND"] = 60] = "FRAMES_PER_SECOND";
    Settings[Settings["DEGREES_OF_VISON"] = 90] = "DEGREES_OF_VISON";
    Settings[Settings["MAX_DISTANCE"] = 1000] = "MAX_DISTANCE";
    Settings[Settings["MAX_PERCENT_BRIGHTNESS"] = 100] = "MAX_PERCENT_BRIGHTNESS";
    Settings[Settings["MIN_PERCENT_BRIGHTNESS"] = 8] = "MIN_PERCENT_BRIGHTNESS";
    Settings[Settings["FADE_DISTANCE"] = 15] = "FADE_DISTANCE";
    Settings[Settings["CANVAS_WIDTH"] = 800] = "CANVAS_WIDTH";
    Settings[Settings["CANVAS_HEIGHT"] = 600] = "CANVAS_HEIGHT";
})(Settings || (exports.Settings = Settings = {}));
