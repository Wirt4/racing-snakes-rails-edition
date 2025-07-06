"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMap = void 0;
const settings_1 = require("./settings");
const angle_1 = require("./angle");
const color_1 = require("./color");
const point_1 = require("./point");
class GameMap {
    constructor(player, walls) {
        this.player = player;
        this.walls = walls;
    }
    draw(renderer) {
        for (let i = 0; i < settings_1.Settings.RESOLUTION; i++) {
            const angle = this.getRayAngle(i);
            const { distance, color } = this.castRay(angle);
            const correctedDistance = this.removeFishEye(distance, angle, this.player.angle);
            const sliceHeight = this.calculateSliceHeight(correctedDistance, settings_1.Settings.CANVAS_HEIGHT);
            const brightness = this.calculateBrightness(correctedDistance);
            renderer.fillColor(color, brightness);
            this.renderVerticalSlice(renderer, i, sliceHeight);
        }
        this.draw2DMap(renderer, angle_1.Angle.fromDegrees(settings_1.Settings.DEGREES_OF_VISION).radians);
    }
    update() {
        // Update game state, e.g., player position, wall states, etc.
        // This method can be expanded based on game logic
        // For now, it does nothing except demonstrate the 3D-ness
        this.player.angle += 0.01;
    }
    getRayAngle(index) {
        //this conversion is a little wonky, would like to precomput the radians before entering the loop
        return this.player.angle - angle_1.Angle.fromDegrees(settings_1.Settings.DEGREES_OF_VISION).radians / 2 + (index / settings_1.Settings.RESOLUTION) * angle_1.Angle.fromDegrees(settings_1.Settings.DEGREES_OF_VISION).radians;
    }
    castRay(angle) {
        //this really isn't descriptive the dx/dy bit that's going on
        const rayDirection = { x: Math.cos(angle), y: Math.sin(angle) };
        // This method will cast a ray in the direction of the angle
        // and return the distance to the nearest wall and its color
        let color = color_1.Color.NONE;
        let closest = { isValid: false, x: -1, y: -1, distance: Infinity };
        //consider a foreach loop below
        for (const wall of this.walls) {
            const hit = this.rayIntersectsWall(this.player.position, rayDirection, wall);
            if (hit.isValid && (!closest.isValid || hit.distance < closest.distance)) {
                closest = hit;
                color = wall.color;
            }
        }
        if (closest.isValid) {
            return { distance: closest.distance, color };
        }
        return { distance: settings_1.Settings.MAX_DISTANCE, color };
    }
    rayIntersectsWall(rayOrigin, direction, wall) {
        const { start: wallStart, end: wallEnd } = wall;
        const rayPoint = new point_1.Point(rayOrigin.x + direction.x, rayOrigin.y + direction.y);
        const determinant = this.calculateDeterminant(wallStart, wallEnd, rayOrigin, rayPoint);
        if (this.isParallel(determinant))
            return { isValid: false, x: -1, y: -1, distance: Infinity };
        const wall_intersection = this.wallIntersection(wallStart, rayOrigin, rayPoint, determinant);
        const ray_intersection = this.rayIntersection(wallStart, wallEnd, rayOrigin, determinant);
        if (!this.isInsideWall(wall_intersection, ray_intersection))
            return { isValid: false, x: -1, y: -1, distance: Infinity };
        const intersectionX = wallStart.x + wall_intersection * (wallEnd.x - wallStart.x);
        const intersectionY = wallStart.y + wall_intersection * (wallEnd.y - wallStart.y);
        const distance = this.dist(rayOrigin.x, rayOrigin.y, intersectionX, intersectionY);
        return { isValid: true, x: intersectionX, y: intersectionY, distance };
    }
    calculateDeterminant(wallStart, wallEnd, rayOrigin, rayPoint) {
        return (wallStart.x - wallEnd.x) * (rayOrigin.y - rayPoint.y) - (wallStart.y - wallEnd.y) * (rayOrigin.x - rayPoint.x);
    }
    isParallel(determinant) {
        const threshold = 0.00001;
        return Math.abs(determinant) < threshold;
    }
    wallIntersection(wallStart, rayOrigin, rayPoint, determinant) {
        const foo = (wallStart.x - rayOrigin.x) * (rayOrigin.y - rayPoint.y);
        const bar = (wallStart.y - rayOrigin.y) * (rayOrigin.x - rayPoint.x);
        const diff = foo - bar;
        return diff / determinant;
    }
    rayIntersection(wallStart, wallEnd, rayOrigin, determinant) {
        const foo = (wallStart.x - wallEnd.x) * (wallStart.y - rayOrigin.y);
        const bar = (wallStart.y - wallEnd.y) * (wallStart.x - rayOrigin.x);
        const diff = -(foo - bar);
        return diff / determinant;
    }
    isInsideWall(wall_intersection, ray_intersection) {
        return wall_intersection >= 0 && wall_intersection <= 1 && ray_intersection >= 0;
    }
    dist(x1, y1, x2, y2) {
        //hacky pythagorean distance formula
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    // the viewer's angle is an unnecessary parameter
    removeFishEye(distance, angle, viewerAngle) {
        return distance * Math.cos(angle - viewerAngle);
    }
    calculateSliceHeight(distance, height) {
        if (distance <= 0) {
            return 2 * height; // Avoid division by zero
        }
        return height / distance;
    }
    calculateBrightness(distance) {
        return Math.max(settings_1.Settings.MIN_PERCENT_BRIGHTNESS, settings_1.Settings.MAX_PERCENT_BRIGHTNESS - distance * settings_1.Settings.FADE_DISTANCE);
    }
    renderVerticalSlice(renderer, fieldOfVisionXCoord, sliceHeight) {
        renderer.rect(fieldOfVisionXCoord, settings_1.Settings.CANVAS_HEIGHT / 2 - sliceHeight / 2, 1, sliceHeight);
    }
    draw2DMap(renderer, angle) {
        // This method can be used to draw a 2D map of the game world
        renderer.save();
        renderer.scale(10);
        renderer.stroke(color_1.Color.WHITE);
        for (const wall of this.walls) {
            wall.draw2D(renderer);
        }
        this.player.draw2D(renderer);
        //for debugging
        this.drawRays(renderer);
        renderer.restore();
    }
    drawRays(renderer) {
        renderer.stroke(color_1.Color.GREEN);
        renderer.strokeWeight(0.05);
        const resolution = 20;
        for (let i = 0; i < settings_1.Settings.CANVAS_WIDTH; i += resolution) {
            const rayAngle = this.getRayAngle(i);
            const { distance } = this.castRay(rayAngle);
            const hit = this.player.position.nextLocation(rayAngle, distance);
            renderer.line(this.player.position.x, this.player.position.y, hit.x, hit.y);
        }
    }
}
exports.GameMap = GameMap;
