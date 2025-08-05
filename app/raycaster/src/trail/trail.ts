import { TrailInterface } from './interface'
import { Coordinates } from '../geometry/interfaces'

export class Trail implements TrailInterface {
	add(coordinates: Coordinates) {
	}

	hasIntersected(): boolean {
		return false
	}
}
