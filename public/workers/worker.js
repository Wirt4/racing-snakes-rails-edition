// src/game/color/color_profiles.ts
function nameToProfile(color_label) {
  switch (color_label) {
    case "YELLOW" /* YELLOW */:
      return { hue: 70, saturation: 1, lightness: 0.65 };
    case "BLUE" /* BLUE */:
      return { hue: 200, saturation: 1, lightness: 0.55 };
    case "RED" /* RED */:
      return { hue: 0, saturation: 1, lightness: 0.6 };
    case "GREEN" /* GREEN */:
      return { hue: 120, saturation: 1, lightness: 0.5 };
    case "WHITE" /* WHITE */:
      return { hue: 330, saturation: 1, lightness: 0.55 };
    case "BLACK" /* BLACK */:
      return { hue: 270, saturation: 0.4, lightness: 0.08 };
    case "PURPLE" /* PURPLE */:
      return { hue: 280, saturation: 1, lightness: 0.6 };
    case "ORANGE" /* ORANGE */:
      return { hue: 20, saturation: 1, lightness: 0.6 };
    default:
      throw new Error(`Unknown color label: ${color_label}`);
  }
}

// src/renderer/hsl/hsl.ts
var HSL = class {
  constructor(hue, saturation, lightness) {
    this.assertInRange(hue, 0, 360, "Hue");
    this.hue = hue;
    this.assertSatOrLight(saturation, "Saturation");
    this.saturation = saturation;
    this.assertSatOrLight(lightness, "Lightness");
    this.lightness = lightness;
  }
  toHex() {
    const chomaticAdjustmentFactor = this.saturation * Math.min(this.lightness, 1 - this.lightness);
    const redHex = this.colorChannelToHex(0, chomaticAdjustmentFactor);
    const greenHex = this.colorChannelToHex(8, chomaticAdjustmentFactor);
    const blueHex = this.colorChannelToHex(4, chomaticAdjustmentFactor);
    return `#${redHex}${greenHex}${blueHex}`;
  }
  colorChannelToHex(channel, adjustmentFactor) {
    const wheelColor = (channel + this.hue / 30) % 12;
    const color = this.lightness - adjustmentFactor * Math.max(Math.min(wheelColor - 3, 9 - wheelColor, 1), -1);
    return Math.round(255 * color).toString(16).toUpperCase().padStart(2, "0");
  }
  assertSatOrLight(value, name) {
    this.assertInRange(value, 0, 1, name);
  }
  assertInRange(value, min, max, name) {
    if (value < min || value > max) {
      throw new Error(`${name} must be between ${min} and ${max}`);
    }
  }
};

// src/renderer/hsl/hsl_factory.ts
function hslFactory(colorName) {
  const { hue, saturation, lightness } = nameToProfile(colorName);
  return new HSL(hue, saturation, lightness);
}

// src/renderer/renderer.ts
var Renderer = class {
  constructor(context) {
    this.context = context;
    this.hslCache = {};
    this.lastFillColorStyle = "transparent";
    this.lastStrokeColorStyle = "transparent";
  }
  scale(scale) {
    this.context.scale(scale, scale);
  }
  save() {
    this.context.save();
  }
  restore() {
    this.context.restore();
  }
  reset() {
    this.context.reset();
  }
  strokeWeight(weight) {
    this.context.lineWidth = weight;
  }
  line(line) {
    const { start, end } = line;
    this.context.beginPath();
    this.context.moveTo(start.x, start.y);
    this.context.lineTo(end.x, end.y);
    this.context.stroke();
  }
  rect(origin, width, height) {
    this.context.fillRect(origin.x, origin.y, width, height);
  }
  fillColor(color, brightness2 = 100) {
    if (brightness2 < 0 || brightness2 > 100) {
      throw new Error("Brightness must be between 0 and 100");
    }
    const brightnessPercent = brightness2 / 100;
    let hsl;
    if (color == "NONE" /* NONE */) {
      hsl = this.getCachedHSL("WHITE" /* WHITE */);
    } else {
      hsl = this.getCachedHSL(color);
    }
    hsl.lightness = brightnessPercent;
    const hxcd = hsl.toHex();
    if (this.lastFillColorStyle === hxcd) {
      return;
    }
    this.context.fillStyle = hxcd;
    this.lastFillColorStyle = hxcd;
  }
  ellipse(origin, stroke) {
    this.context.lineWidth = stroke;
    this.context.ellipse(origin.x, origin.y, 1, 1, 0, 0, 0);
  }
  noStroke() {
    if (this.context.strokeStyle === "transparent") {
      return;
    }
    this.context.strokeStyle = "transparent";
  }
  stroke(color) {
    if (color === this.lastStrokeColorStyle) {
      return;
    }
    this.context.strokeStyle = this.getCachedHSL(color).toHex();
    this.lastStrokeColorStyle = this.context.strokeStyle;
  }
  getCachedHSL(color) {
    if (!this.hslCache[color]) {
      this.hslCache[color] = hslFactory(color);
    }
    return this.hslCache[color];
  }
};

// src/settings.ts
var Settings = ((Settings2) => {
  Settings2[Settings2["HORIZON_LINE_RATIO"] = 0.65] = "HORIZON_LINE_RATIO";
  Settings2[Settings2["FRAME_HEIGHT"] = -200] = "FRAME_HEIGHT";
  Settings2[Settings2["MAX_BRIGHTNESS"] = 60] = "MAX_BRIGHTNESS";
  Settings2[Settings2["HUD_ON"] = 1] = "HUD_ON";
  Settings2[Settings2["WALL_HEIGHT"] = 7] = "WALL_HEIGHT";
  Settings2[Settings2["CAMERA_HEIGHT"] = 5] = "CAMERA_HEIGHT";
  Settings2[Settings2["FRAMES_PER_SECOND"] = 60] = "FRAMES_PER_SECOND";
  Settings2[Settings2["FIELD_OF_VISION"] = Math.PI / 3] = "FIELD_OF_VISION";
  Settings2[Settings2["MAX_DISTANCE"] = 100] = "MAX_DISTANCE";
  Settings2[Settings2["MAX_PERCENT_BRIGHTNESS"] = 60] = "MAX_PERCENT_BRIGHTNESS";
  Settings2[Settings2["MIN_PERCENT_BRIGHTNESS"] = 30] = "MIN_PERCENT_BRIGHTNESS";
  Settings2[Settings2["FADE_DISTANCE"] = 2] = "FADE_DISTANCE";
  Settings2[Settings2["CANVAS_WIDTH"] = 400] = "CANVAS_WIDTH";
  Settings2[Settings2["HORIZON_Y"] = 200] = "HORIZON_Y";
  Settings2[Settings2["CANVAS_HEIGHT"] = 640] = "CANVAS_HEIGHT";
  Settings2[Settings2["RESOLUTION"] = 400] = "RESOLUTION";
  return Settings2;
})(Settings || {});

// src/game/game.ts
var _Game = class _Game {
  constructor(map) {
    this.fieldOfVision = Settings.FIELD_OF_VISION;
    this.map = map;
  }
  draw(renderer2, raycaster2, brightness2) {
    renderer2.fillColor("BLACK" /* BLACK */, 0.01);
    renderer2.rect({ x: 0, y: 0 }, 400 /* CANVAS_WIDTH */, 640 /* CANVAS_HEIGHT */);
    const rays = raycaster2.getViewRays(this.map.playerAngle);
    const wallBatches = {};
    const gridBatch = [];
    rays.forEach((angle, i) => {
      const { distance, color, gridHits } = this.map.castRay(angle, 100 /* MAX_DISTANCE */);
      const correctedDistance = raycaster2.removeFishEye(distance, angle, this.map.playerAngle);
      const wallTopOffset = 7 /* WALL_HEIGHT */ - 5 /* CAMERA_HEIGHT */;
      const wallBottomOffset = -5 /* CAMERA_HEIGHT */;
      const topY = _Game.HORIZON_Y - wallTopOffset * raycaster2.focalLength / correctedDistance;
      const bottomY = _Game.HORIZON_Y - wallBottomOffset * raycaster2.focalLength / correctedDistance;
      const sliceHeight = bottomY - topY;
      const wallBrightness = brightness2.calculateBrightness(correctedDistance);
      const key = `${color}_${Math.round(wallBrightness * 100)}`;
      if (!wallBatches[key]) wallBatches[key] = [];
      wallBatches[key].push({ x: i, y: topY, width: 1, height: sliceHeight });
      renderer2.fillColor("BLUE" /* BLUE */, 50);
      for (const hit of gridHits) {
        const correctedGridDistance = raycaster2.removeFishEye(hit, angle, this.map.playerAngle);
        const floorOffset = -5 /* CAMERA_HEIGHT */;
        const projectedFloorY = _Game.HORIZON_Y - floorOffset * raycaster2.focalLength / correctedGridDistance;
        gridBatch.push({ x: i, y: projectedFloorY, width: 1, height: 1 });
      }
    });
    for (const [key, rects] of Object.entries(wallBatches)) {
      const [colorName, brightness3] = key.split("_");
      renderer2.fillColor(colorName, Number(brightness3) / 100);
      rects.forEach((r) => renderer2.rect({ x: r.x, y: r.y }, r.width, r.height));
    }
    renderer2.fillColor("BLUE" /* BLUE */, 50);
    gridBatch.forEach((r) => renderer2.rect({ x: r.x, y: r.y }, r.width, r.height));
    if (!1 /* HUD_ON */) return;
    renderer2.save();
    renderer2.scale(2.5);
    const hudWallGroups = {};
    this.map.walls.forEach((wall) => {
      const key = `${wall.color}_0.5`;
      if (!hudWallGroups[key]) hudWallGroups[key] = [];
      hudWallGroups[key].push(wall.line);
    });
    for (const [key, lines] of Object.entries(hudWallGroups)) {
      const [color, weight] = key.split("_");
      renderer2.stroke(color);
      renderer2.strokeWeight(Number(weight));
      lines.forEach((line) => renderer2.line(line));
    }
    renderer2.stroke("WHITE" /* WHITE */);
    renderer2.fillColor("RED" /* RED */, 100);
    renderer2.noStroke();
    renderer2.ellipse(this.map.playerPosition, 0.2);
    renderer2.stroke("GREEN" /* GREEN */);
    renderer2.strokeWeight(0.05);
    rays.forEach((angle) => {
      const { distance } = this.map.castRay(angle, 100 /* MAX_DISTANCE */);
      const hit = this.nextLocation(this.map.playerPosition, angle, distance);
      renderer2.line({ start: this.map.playerPosition, end: hit });
    });
    renderer2.restore();
  }
  update() {
    this.map.movePlayer();
  }
  calculateDeterminant(wallStart, wallEnd, rayOrigin, rayPoint) {
    return (wallStart.x - wallEnd.x) * (rayOrigin.y - rayPoint.y) - (wallStart.y - wallEnd.y) * (rayOrigin.x - rayPoint.x);
  }
  wallIntersection(wallStart, rayOrigin, rayPoint, determinant) {
    const numerator1 = (wallStart.x - rayOrigin.x) * (rayOrigin.y - rayPoint.y);
    const numerator2 = (wallStart.y - rayOrigin.y) * (rayOrigin.x - rayPoint.x);
    const diff = numerator1 - numerator2;
    return diff / determinant;
  }
  rayIntersection(wallStart, wallEnd, rayOrigin, determinant) {
    const numerator1 = (wallStart.x - wallEnd.x) * (wallStart.y - rayOrigin.y);
    const numerator2 = (wallStart.y - wallEnd.y) * (wallStart.x - rayOrigin.x);
    const diff = -(numerator1 - numerator2);
    return diff / determinant;
  }
  nextLocation(coordinates, angle, distance) {
    return {
      x: coordinates.x + Math.cos(angle) * distance,
      y: coordinates.y + Math.sin(angle) * distance
    };
  }
};
_Game.HORIZON_Y = 0.65 /* HORIZON_LINE_RATIO */ * 640 /* CANVAS_HEIGHT */;
var Game = _Game;

// src/gamemap/map.ts
var GameMap = class {
  constructor(width, height, boundaryColor = "BLACK" /* BLACK */, gridCell = 2) {
    this.walls = [];
    this.gridLinesX = [];
    this.gridLinesY = [];
    this.playerPosition = { x: 0, y: 0 };
    this.playerAngle = 0;
    this.gridLinesY = this.generateGridLines(gridCell, height, width, true);
    this.gridLinesX = this.generateGridLines(gridCell, width, height, false);
    const left_top = { x: 0, y: 0 };
    const left_bottom = { x: 0, y: height };
    const right_top = { x: width, y: 0 };
    const right_bottom = { x: width, y: height };
    this.walls = [
      this.initializeWall(left_top, left_bottom, boundaryColor),
      this.initializeWall(left_top, right_top, boundaryColor),
      this.initializeWall(right_top, right_bottom, boundaryColor),
      this.initializeWall(left_bottom, right_bottom, boundaryColor)
    ];
  }
  appendWall(wall) {
    this.walls.push(wall);
  }
  movePlayer() {
    const speed = 0.2;
    this.playerPosition.x += Math.cos(this.playerAngle) * speed;
    this.playerPosition.y += Math.sin(this.playerAngle) * speed;
  }
  turnPlayer(angle = 0) {
    this.playerAngle = (this.playerAngle + angle) % (2 * Math.PI);
    if (this.playerAngle < 0) this.playerAngle += 2 * Math.PI;
  }
  castRay(angle, maximumAllowableDistance) {
    const rayDirection = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    };
    let closest = {
      isValid: false,
      x: -1,
      y: -1,
      distance: maximumAllowableDistance
    };
    let color = "NONE" /* NONE */;
    for (const wall of this.walls) {
      const hit = this.rayIntersectsWall(this.playerPosition, rayDirection, wall);
      if (hit.isValid && hit.distance < closest.distance) {
        closest = hit;
        color = wall.color;
      }
    }
    const maxDistance = closest.isValid ? closest.distance : maximumAllowableDistance;
    const rayEnd = {
      x: this.playerPosition.x + rayDirection.x * maxDistance,
      y: this.playerPosition.y + rayDirection.y * maxDistance
    };
    const gridHits = [];
    for (const grid of [...this.gridLinesX, ...this.gridLinesY]) {
      const hit = this.rayIntersectsWall(this.playerPosition, rayDirection, {
        line: grid,
        color: "BLUE" /* BLUE */
      });
      if (hit.isValid && hit.distance < maxDistance) {
        gridHits.push(hit.distance);
      }
    }
    return {
      distance: closest.distance,
      color,
      gridHits,
      intersection: rayEnd
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
    const { start: wallStart, end: wallEnd } = wall.line;
    const rayPoint = { x: rayOrigin.x + direction.x, y: rayOrigin.y + direction.y };
    const determinant = this.calculateDeterminant(wallStart, wallEnd, rayOrigin, rayPoint);
    const result = { isValid: false, x: -1, y: -1, distance: Infinity };
    if (this.isParallel(determinant)) {
      return result;
    }
    const wall_intersection = this.wallIntersection(wallStart, rayOrigin, rayPoint, determinant);
    const ray_intersection = this.rayIntersection(wallStart, wallEnd, rayOrigin, determinant);
    if (!this.isInsideWall(wall_intersection, ray_intersection)) {
      return result;
    }
    result.isValid = true;
    result.x = wallStart.x + wall_intersection * (wallEnd.x - wallStart.x);
    result.y = wallStart.y + wall_intersection * (wallEnd.y - wallStart.y);
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
      } else {
        lines.push({
          start: { x: 0, y: i },
          end: { x: secondary, y: i }
        });
      }
    }
    return lines;
  }
};

// src/utils.ts
function assertIsNonNegative(value) {
  if (typeof value !== "number" || value < 0) {
    throw new Error("Value must be a non-negative number");
  }
}
function assertIsPositive(value) {
  assertIsNonNegative(value);
  if (value === 0) {
    throw new Error("Value must be a positive number");
  }
}
function assertIsPositiveInteger(value) {
  assertIsPositive(value);
  if (!Number.isInteger(value)) {
    throw new Error("Value must be an integer");
  }
}

// src/geometry/constants.ts
var FULL_CIRCLE = Math.PI * 2;
var SIXTY_DEGREES = Math.PI / 3;
var NINETY_DEGREES = Math.PI / 2;
var FORTY_FIVE_DEGREES = Math.PI / 4;

// src/raycaster/raycaster.ts
var Raycaster = class {
  constructor(resolution, fieldOfView, screenWidth, screenHeight, maxDistance = 1e3, horizonY = 200 /* HORIZON_Y */) {
    this.resolution = resolution;
    this.fieldOfView = fieldOfView;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.maxDistance = maxDistance;
    this.horizonY = horizonY;
    this.fieldOfView = fieldOfView;
    assertIsPositiveInteger(this.resolution);
    if (this.fieldOfView < 0 || this.fieldOfView > FULL_CIRCLE) {
      throw new Error("Field of view must be between 0 and 2*Math.PI");
    }
    this.offsets = [];
    const step = this.fieldOfView / this.resolution;
    for (let i = this.resolution - step; i >= 0; i--) {
      this.offsets.push(i * step);
    }
    this.fovOffset = this.fieldOfView / 2;
    const aspectRatio = screenWidth / screenHeight;
    const verticalFOV = 2 * Math.atan(Math.tan(this.fieldOfView / 2) / aspectRatio);
    this.focalLength = this.screenWidth / (2 * Math.tan(verticalFOV / 2));
  }
  getViewRays(viewerAngle) {
    const rays = new Array();
    this.offsets.forEach((offset) => {
      rays.push(this.normalizeAngle(offset + viewerAngle - this.fovOffset));
    });
    return rays;
  }
  removeFishEye(distance, centerAngle, relativeAngle) {
    if (this.fieldOfView >= NINETY_DEGREES) {
      return distance;
    }
    return distance * Math.cos(relativeAngle - centerAngle);
  }
  wallHeightToSliceHeight(distance, height) {
    assertIsNonNegative(distance);
    assertIsPositive(height);
    if (distance === 0) {
      return this.screenHeight;
    }
    const wallBase = 0;
    const wallTop = wallBase + 7 /* WALL_HEIGHT */;
    const cameraY = 5 /* CAMERA_HEIGHT */;
    const topOffset = wallTop - cameraY;
    const bottomOffset = wallBase - cameraY;
    const topY = this.horizonY - topOffset * this.focalLength / distance;
    const bottomY = this.horizonY - bottomOffset * this.focalLength / distance;
    return bottomY - topY;
  }
  calculateBrightness(distance) {
    if (distance > this.maxDistance) {
      return 0;
    }
    return 100 * (1 - distance / this.maxDistance);
  }
  normalizeAngle(angle) {
    if (angle < 0) {
      return angle + FULL_CIRCLE;
    }
    if (angle > FULL_CIRCLE) {
      return angle - FULL_CIRCLE;
    }
    return angle;
  }
};

// src/brightness/brightness.ts
var Brightness = class {
  constructor(maxDistance, maxBrightness = 100) {
    this.maxDistance = maxDistance;
    this.maxBrightness = maxBrightness;
  }
  calculateBrightness(distance) {
    const ratio = distance / this.maxDistance;
    if (ratio > 1) {
      return 0;
    }
    return (1 - ratio) * this.maxBrightness;
  }
};

// src/worker/worker.ts
var game;
var renderer;
var raycaster;
var brightness;
var running = false;
onmessage = (e) => {
  const msg = e.data;
  if (msg.type === "init") {
    const ctx = msg.canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get 2D context from OffscreenCanvas");
      return;
    }
    renderer = new Renderer(ctx);
    const map = new GameMap(1e3, 1e3, msg.settings.MAP_COLOR);
    map.playerPosition = msg.mapData.playerPosition;
    map.playerAngle = msg.mapData.playerAngle;
    map.walls = msg.mapData.walls;
    game = new Game(map);
    raycaster = new Raycaster(
      msg.settings.RESOLUTION,
      msg.settings.FIELD_OF_VISION,
      msg.settings.CANVAS_WIDTH,
      msg.settings.CANVAS_HEIGHT,
      msg.settings.MAX_DISTANCE
    );
    brightness = new Brightness(msg.settings.MAX_DISTANCE, msg.settings.MAX_BRIGHTNESS);
    startLoop();
  }
  if (msg.type === "mouseTurn") {
    game.map.turnPlayer(msg.angleDelta);
  }
  if (msg.type === "KeyDown") {
    game.map.turnPlayer;
  }
};
function startLoop() {
  if (running) return;
  running = true;
  function loop() {
    renderer.reset();
    game.draw(renderer, raycaster, brightness);
    game.update();
    requestAnimationFrame(loop);
  }
  ;
  requestAnimationFrame(loop);
}
