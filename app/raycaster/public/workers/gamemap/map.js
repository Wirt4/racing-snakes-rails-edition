import { BMath } from '../boundedMath/bmath';
export class GameMap {
    constructor(arena, player) {
        this._walls = [];
        this.intersectionPool = [];
        this.rayPoint = { x: 0, y: 0 };
        this.bMath = BMath.getInstance();
        this.player = player;
        this._walls = arena.walls;
        for (let i = 0; i < 1000; i++) {
            this.intersectionPool.push({ isValid: false, x: -1, y: -1, distance: Infinity });
        }
        this.arena = arena;
    }
    get walls() {
        return [...this.arena.walls, ...this.player.trail.slice(0, -1)];
    }
    isCrossing(verticalSegment, horizontalSegment) {
        if (verticalSegment.hStart < horizontalSegment.hStart || verticalSegment.hStart > horizontalSegment.hEnd) {
            return false;
        }
        return (horizontalSegment.vStart >= verticalSegment.vStart && horizontalSegment.vStart <= verticalSegment.vEnd);
    }
    resetIntersections() {
    }
    appendWall(wall) {
        this.walls.push(wall);
    }
    movePlayer() {
        this.player.move();
    }
    turnPlayer(angle) {
        if (angle < 0) {
            this.player.turnRight();
        }
        else if (angle > 0) {
            this.player.turnLeft();
        }
    }
    getGridHits(origin, rayDirection, maxDistance) {
        const gridHits = [];
        for (const grid of this.arena.gridLines) {
            const hit = this.rayIntersectsWall(origin, rayDirection, grid);
            if (hit.isValid && hit.distance < maxDistance) {
                gridHits.push(hit.distance);
            }
        }
        return gridHits;
    }
    getRayEnd(rayDirection, distance) {
        return {
            x: this.player.x + rayDirection.x * distance,
            y: this.player.y + rayDirection.y * distance
        };
    }
    deafaultIntersection(distance) {
        return {
            isValid: false,
            x: -1,
            y: -1,
            distance
        };
    }
    rayDirecton(angle) {
        return {
            x: this.bMath.cos(angle),
            y: this.bMath.sin(angle)
        };
    }
    rayIntersection(wallStart, wallEnd, rayOrigin, determinant) {
        const numerator1 = (wallStart.x - wallEnd.x) * (wallStart.y - rayOrigin.y);
        const numerator2 = (wallStart.y - wallEnd.y) * (wallStart.x - rayOrigin.x);
        const diff = -(numerator1 - numerator2);
        return diff / determinant;
    }
    isInsideWall(wall_intersection, ray_intersection) {
        return wall_intersection >= 0 && wall_intersection <= 1 && ray_intersection >= 0;
    }
    dist(coordinatesA, coordinatesB) {
        return Math.sqrt((coordinatesB.x - coordinatesA.x) ** 2 + (coordinatesB.y - coordinatesA.y) ** 2);
    }
    rayIntersectsWall(rayOrigin, direction, wall) {
        this.rayPoint.x = rayOrigin.x + direction.x;
        this.rayPoint.y = rayOrigin.y + direction.y;
        const rayPoint = this.rayPoint;
        const determinant = this.calculateDeterminant(wall.start, wall.end, rayOrigin, rayPoint);
        const result = { isValid: false, x: -1, y: -1, distance: Infinity };
        if (this.isParallel(determinant)) {
            return result;
        }
        const wall_intersection = this.wallIntersection(wall.start, rayOrigin, rayPoint, determinant);
        const ray_intersection = this.rayIntersection(wall.start, wall.end, rayOrigin, determinant);
        if (!this.isInsideWall(wall_intersection, ray_intersection)) {
            return result;
        }
        result.isValid = true;
        result.x = wall.start.x + wall_intersection * (wall.end.x - wall.start.x);
        result.y = wall.start.y + wall_intersection * (wall.end.y - wall.start.y);
        result.distance = this.dist(rayOrigin, result);
        return result;
    }
    wallIntersection(wallStart, rayOrigin, rayPoint, determinant) {
        const numerator1 = (wallStart.x - rayOrigin.x) * (rayOrigin.y - rayPoint.y);
        const numerator2 = (wallStart.y - rayOrigin.y) * (rayOrigin.x - rayPoint.x);
        const diff = numerator1 - numerator2;
        return diff / determinant;
    }
    calculateDeterminant(wallStart, wallEnd, rayOrigin, rayPoint) {
        return (wallStart.x - wallEnd.x) * (rayOrigin.y - rayPoint.y) - (wallStart.y - wallEnd.y) * (rayOrigin.x - rayPoint.x);
    }
    isParallel(determinant) {
        return Math.abs(determinant) < 1e-5;
    }
    initializeWall(start, end, color) {
        return {
            line: { start, end },
            color
        };
    }
    generateGridLines(step, primary, secondary, isVerical = false) {
        const lines = [];
        for (let i = step; i <= primary; i += step) {
            if (isVerical) {
                lines.push({
                    start: { x: i, y: 0 },
                    end: { x: i, y: secondary }
                });
            }
            else {
                lines.push({
                    start: { x: 0, y: i },
                    end: { x: secondary, y: i }
                });
            }
        }
        return lines;
    }
}
class TrailSegment {
    constructor(line) {
        this.start = line.start;
        this.end = line.end;
    }
    get isVertical() {
        return this.start.x === this.end.x;
    }
    get hStart() {
        return Math.min(this.start.x, this.end.x);
    }
    get hEnd() {
        return Math.max(this.start.x, this.end.x);
    }
    get vStart() {
        return Math.min(this.start.y, this.end.y);
    }
    get vEnd() {
        return Math.max(this.start.y, this.end.y);
    }
}
