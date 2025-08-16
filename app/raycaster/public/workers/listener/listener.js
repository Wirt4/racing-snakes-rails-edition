const type = "turn";
var DirectionRecord;
(function (DirectionRecord) {
    DirectionRecord["LEFT"] = "LEFT";
    DirectionRecord["RIGHT"] = "RIGHT";
    DirectionRecord["NONE"] = "none";
})(DirectionRecord || (DirectionRecord = {}));
class Listener {
    constructor(worker) {
        this.worker = worker;
        this.lastDirection = DirectionRecord.NONE;
        this.leftKey = "ArrowLeft";
        this.rightKey = "ArrowRight";
    }
    keydown(keystroke) {
        if (!this.isValidKey(keystroke)) {
            return;
        }
        this.handleValidKey(keystroke);
    }
    keyup(keystroke) {
        if (!(this.isValidKey(keystroke) && this.isLastDirection(keystroke))) {
            return;
        }
        this.lastDirection = DirectionRecord.NONE;
    }
    isLastDirection(keystroke) {
        return this.lastDirection === this.keystrokeToDirection(keystroke);
    }
    keystrokeToDirection(keystroke) {
        return this.leftKey === keystroke ? DirectionRecord.LEFT : DirectionRecord.RIGHT;
    }
    isValidKey(keystroke) {
        return keystroke === this.leftKey || keystroke === this.rightKey;
    }
    handleValidKey(keystroke) {
        const direction = this.keystrokeToDirection(keystroke);
        this.postIfDirectionChanged(direction);
        this.lastDirection = direction;
    }
    postIfDirectionChanged(direction) {
        if (direction !== this.lastDirection) {
            this.worker.postMessage({ type, direction });
        }
    }
}
export { Listener };
