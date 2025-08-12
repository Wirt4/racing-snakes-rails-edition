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
//General Form
//if y = mx + b
//then ax +by +c =0
interface GeneralForm {
	a: number;
	b: number;
	c: number;
}
export { Dimensions, Coordinates, LineSegment, Ray, GeneralForm };
