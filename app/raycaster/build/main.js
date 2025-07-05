const MAX_BRIGHTNESS = 255; // maximum brightness for walls
const MIN_BRIGHTNESS = 20;// minimum brightness for walls
const FIELD_OF_VIEW = Math.PI / 2; // 90 degrees field of view
const FADE_POINT = 15; // distance at which brightness fades to minimum

let player = {};
let walls = [];

function setup() {
    let canvas = createCanvas(640, 400);
    canvas.parent("raycast-canvas");
    noStroke();
    topWall = new Wall(1, 1, 58, 1);
    rightWall = new Wall(58, 1, 58, 58);
    bottomWall = new Wall(58, 58, 1, 58);
    leftWall = new Wall(1, 58, 1, 1);

    walls = [
        topWall,
        new Wall(40, 30, 5, 10, 'red'),
        new Wall(5, 10, 70, 30, 'red'),
        rightWall,
        bottomWall,
        leftWall,
    ];

    player = new Player(4.5, 4.5, 0)
    player.draw2D();
}

class Wall {
    constructor(x1, y1, x2, y2, color = null) {
        this.start = new Point(x1, y1);
        this.end = new Point(x2, y2);
        this.color = color;
    }

    draw2D() {
        stroke(this.color || MAX_BRIGHTNESS);
        strokeWeight(0.1);
        line(this.start.x, this.start.y, this.end.x, this.end.y);
    }
}

class Player {
    //angle is in radians
    constructor(x, y, angle) {
        this.position = new Point(x, y);
        this.angle = angle;
    }

    draw2D() {
        fillColor('red');
        noStroke();
        ellipse(this.position.x, this.position.y, 0.2);
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    nextLocation(angle, distance) {
        if (distance < 0) {
            throw new Error("Distance must be non-negative");
        }
        return new Point(
            this.x + cos(angle) * distance,
            this.y + sin(angle) * distance
        );
    }
}

function fillColor(color, brightness = MAX_BRIGHTNESS) {
    if (color === 'red') {
        fill(brightness, 0, 0);
    } else {
        fill(0, brightness, 0);
    }
}

function draw() {
    background(0);

    for (let i = 0; i < width; i++) {
        const rayAngle = getRayAngle(i);
        let { dist, color } = castRay(rayAngle);
        let correctedDist = removeFishEye(dist, rayAngle, player.angle);
        let wallHeight = calculateWallHeight(correctedDist);
        let brightness = calculateBrightness(correctedDist);
        fillColor(color, brightness);
        renderVerticalSlice(i, wallHeight);
    }
    drawMap2D(FIELD_OF_VIEW);
    player.angle += 0.01; // rotate player for demonstration
}

function getRayAngle(increment) {
    return player.angle - FIELD_OF_VIEW / 2 + (increment / width) * FIELD_OF_VIEW;
}

function castRay(angle) {
    let rayDir = { x: cos(angle), y: sin(angle) };
    let origin = player.position;
    let closest = null;
    let color = null;

    for (let wall of walls) {

        let hit = rayIntersectsWall(origin, rayDir, wall);
        if (hit && (!closest || hit.distance < closest.distance)) {
            closest = hit;
            color = wall.color
        }
    }
    if (closest) {
        return { dist: closest.distance, color };
    }

    return { dist: 1000, color };
}

function removeFishEye(distance, angle, viewerAngle) {
    return distance * cos(angle - viewerAngle);
}

function calculateWallHeight(distance) {
    if (distance <= 0) {
        return 2 * height;
    }
    return height / distance;
}

function calculateBrightness(distance) {
    return max(MIN_BRIGHTNESS, MAX_BRIGHTNESS - distance * FADE_POINT);
}

function renderVerticalSlice(fieldOfVisionXCoord, wallHeight) {
    rect(fieldOfVisionXCoord, height / 2 - wallHeight / 2, 1, wallHeight);
}

function drawMap2D(fov) {
    push();
    scale(10);
    stroke(MAX_BRIGHTNESS);
    for (let wall of walls) {
        wall.draw2D();
    }

    fill('red');
    noStroke();
    player.draw2D();

    drawRays();

    pop();
}

function drawRays() {
    stroke(0, MAX_BRIGHTNESS, 0, 100);
    strokeWeight(0.05);
    let resolution = 20
    for (let i = 0; i < width; i += resolution) {
        const rayAngle = getRayAngle(i);
        let { dist } = castRay(rayAngle);
        hit = player.position.nextLocation(rayAngle, dist);
        line(player.position.x, player.position.y, hit.x, hit.y);
    }
}

function rayIntersectsWall(rayOrigin, rayDir, wall) {
    const { start: wallStart, end: wallEnd } = wall;
    const rayPoint = new Point(rayOrigin.x + rayDir.x, rayOrigin.y + rayDir.y);
    const determinant = calculateDeterminant(wallStart, wallEnd, rayOrigin, rayPoint);
    if (isParallel(determinant)) return null;

    const wall_intersection = wallIntersection(wallStart, rayOrigin, rayPoint, determinant);
    const ray_intersection = rayIntersection(wallStart, wallEnd, rayOrigin, determinant);

    if (!isInsideWall(wall_intersection, ray_intersection)) return null;

    const intersectionX = wallStart.x + wall_intersection * (wallEnd.x - wallStart.x);
    const intersectionY = wallStart.y + wall_intersection * (wallEnd.y - wallStart.y);
    const distance = dist(rayOrigin.x, rayOrigin.y, intersectionX, intersectionY);

    return { x: intersectionX, y: intersectionY, distance };
}

function calculateDeterminant(wallStart, wallEnd, rayOrigin, rayPoint) {
    return (wallStart.x - wallEnd.x) * (rayOrigin.y - rayPoint.y) - (wallStart.y - wallEnd.y) * (rayOrigin.x - rayPoint.x);
}

function isParallel(determinant) {
    let threshold = 0.00001;
    return abs(determinant) < threshold;
}

function wallIntersection(wallStart, rayOrigin, rayPoint, determinant) {
    const foo = (wallStart.x - rayOrigin.x) * (rayOrigin.y - rayPoint.y)
    const bar = (wallStart.y - rayOrigin.y) * (rayOrigin.x - rayPoint.x)
    const diff = foo - bar
    return diff / determinant;
}

function rayIntersection(wallStart, wallEnd, rayOrigin, determinant) {
    const foo = (wallStart.x - wallEnd.x) * (wallStart.y - rayOrigin.y)
    const bar = (wallStart.y - wallEnd.y) * (wallStart.x - rayOrigin.x)
    const diff = -(foo - bar);
    return diff / determinant;
}

function isInsideWall(wall_intersection, ray_intersection) {
    return wall_intersection >= 0 && wall_intersection <= 1 && ray_intersection >= 0;
}
