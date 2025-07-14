interface Coordinates {
	x: number;
	y: number;
}

interface Dimensions {
	width: number;
	height: number;
}

interface LineSegment {
	start: Coordinates;
	end: Coordinates;
}

interface Ray {
	origin: Coordinates;
	angle: number; //in radians -- todo: refactor all angles to radians, then reduce the angle object
	magnitude: number;
}

export { Dimensions, Coordinates, LineSegment, Ray };
