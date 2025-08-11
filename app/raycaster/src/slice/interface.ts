import { ColorName } from '../color/color_name'
import { Coordinates } from '../geometry/interfaces'

export interface Slice {
	distance: number;
	color: ColorName;
	gridHits: number[];
	intersection: Coordinates;
}

