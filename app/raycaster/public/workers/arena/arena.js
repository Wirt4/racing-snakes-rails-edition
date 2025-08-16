export class Arena {
    constructor(dimensions, cellSize, wallColor) {
        this.dimensions = dimensions;
        this.wallColor = wallColor;
        this._walls = [];
        this.upperLeft = { x: 0, y: 0 };
        this._gridLines = [];
        this.upperRight = { x: this.dimensions.width, y: 0 };
        this.lowerLeft = { x: 0, y: this.dimensions.height };
        this.lowerRight = { x: this.dimensions.width, y: this.dimensions.height };
        this.drawVerticalLines();
        this.drawHorizontalLines();
        this.drawGridLines(cellSize);
    }
    get walls() {
        return this._walls;
    }
    get gridLines() {
        return this._gridLines;
    }
    containsCoordinates(x, y) {
        if (this.inRange(x, this.dimensions.width)) {
            return this.inRange(y, this.dimensions.height);
        }
        else {
            return false;
        }
    }
    inRange(coord, boundary) {
        return 0 <= coord && coord <= boundary;
    }
    drawVerticalLines() {
        const leftEnd = this.lowerLeft;
        const leftStart = this.upperLeft;
        const leftBoundary = this.newWall(leftStart, leftEnd);
        this._walls.push(leftBoundary);
        const rightStart = this.upperRight;
        const rightEnd = this.lowerRight;
        const rightBoundary = this.newWall(rightStart, rightEnd);
        this._walls.push(rightBoundary);
    }
    drawHorizontalLines() {
        const upperStart = this.upperLeft;
        const upperEnd = this.upperRight;
        const upperBoundary = this.newWall(upperStart, upperEnd);
        this._walls.push(upperBoundary);
        const lowerStart = this.lowerLeft;
        const lowerEnd = this.lowerRight;
        const lowerBoundary = this.newWall(lowerStart, lowerEnd);
        this._walls.push(lowerBoundary);
    }
    newWall(start, end) {
        return { line: { start, end }, color: this.wallColor };
    }
    drawGridLines(cellSize) {
        this.addVerticalGridLines(cellSize);
        this.addHorizontalGridLines(cellSize);
    }
    addVerticalGridLines(cellSize) {
        let step = cellSize;
        while (step < this.dimensions.width) {
            this._gridLines.push(this.verticalLine(step));
            step += cellSize;
        }
    }
    addHorizontalGridLines(cellSize) {
        let step = cellSize;
        while (step < this.dimensions.height) {
            this._gridLines.push(this.horizontalLine(step));
            step += cellSize;
        }
    }
    verticalLine(x) {
        return {
            start: { x, y: 0 },
            end: { x, y: this.dimensions.height }
        };
    }
    horizontalLine(y) {
        return {
            start: { x: 0, y },
            end: { x: this.dimensions.width, y }
        };
    }
}
