interface Coordinates {
	x: number;
	y: number;
}

interface LineSegment {
	start: Coordinates;
	end: Coordinates;
}

export { Coordinates, LineSegment };
