import { ColorName } from '../color/color_name';
import { BMath } from '../boundedMath/bmath';
export class GameMap {
    constructor(size, boundaryColor = ColorName.BLACK, gridCell, player) {
        this.walls = [];
        this.gridLinesX = [];
        this.gridLinesY = [];
        this.intersectionPool = [];
        this.intersectionIndex = 0;
        this.rayPoint = { x: 0, y: 0 };
        this.bMath = BMath.getInstance();
        if (!(this.isInRange(player.x, size.width) && this.isInRange(player.y, size.height))) {
            throw new Error("Player position is outside the map boundaries");
        }
        this.player = player;
        this.gridLinesY = this.generateGridLines(gridCell, size.height, size.width, true);
        this.gridLinesX = this.generateGridLines(gridCell, size.width, size.height, false);
        this.gridLines = [...this.gridLinesX, ...this.gridLinesY];
        const left_top = { x: 0, y: 0 };
        const left_bottom = { x: 0, y: size.height };
        const right_top = { x: size.width, y: 0 };
        const right_bottom = { x: size.width, y: size.height };
        this.walls = [
            this.initializeWall(left_top, left_bottom, boundaryColor),
            this.initializeWall(left_top, right_top, boundaryColor),
            this.initializeWall(right_top, right_bottom, boundaryColor),
            this.initializeWall(left_bottom, right_bottom, boundaryColor),
        ];
        for (let i = 0; i < 1000; i++) {
            this.intersectionPool.push({ isValid: false, x: -1, y: -1, distance: Infinity });
        }
    }
    get playerTrail() {
        return this.player.trail;
    }
    get playerPosition() {
        const { x, y } = this.player;
        return { x, y };
    }
    get playerAngle() {
        return this.player.angle;
    }
    prepareFrame() {
        this.intersectionIndex = 0;
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
    castRay(angle, maximumAllowableDistance) {
        const rayDirection = this.rayDirecton(angle);
        let closest = this.deafaultIntersection(maximumAllowableDistance);
        let color = ColorName.NONE;
        const { x, y } = this.player;
        const rayOrigin = { x, y };
        for (const wall of this.walls) {
            const hit = this.rayIntersectsWall(rayOrigin, rayDirection, wall.line);
            if (hit.isValid && hit.distance < closest.distance) {
                closest = hit;
                color = wall.color;
            }
        }
        for (let i = 0; i < this.playerTrail.length - 1; i++) {
            const wall = this.playerTrail[i].line;
            const hit = this.rayIntersectsWall(rayOrigin, rayDirection, wall);
            if (hit.isValid && hit.distance < closest.distance) {
                closest = hit;
                color = this.player.color;
            }
        }
        const rayEnd = this.getRayEnd(rayDirection, closest.distance);
        const gridHits = this.getGridHits(rayOrigin, rayDirection, closest.distance);
        return {
            distance: closest.distance,
            color,
            gridHits,
            intersection: rayEnd
        };
    }
    getIntersection() {
        if (this.intersectionIndex >= this.intersectionPool.length) {
            const length = this.intersectionPool.length;
            for (let i = 0; i < length; i++) {
                this.intersectionPool.push({ isValid: false, x: -1, y: -1, distance: Infinity });
            }
        }
        return this.intersectionPool[this.intersectionIndex++];
    }
    getGridHits(origin, rayDirection, maxDistance) {
        const gridHits = [];
        for (const grid of this.gridLines) {
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
        //should the determinant be clamped here?
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
    isInRange(value, limit) {
        return value < limit && value > 0;
    }
}
