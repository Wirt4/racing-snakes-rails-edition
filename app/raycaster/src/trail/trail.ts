import { TrailInterface } from './interface'
import { Coordinates } from '../geometry/interfaces'

export class Trail implements TrailInterface {
	add(coordinates: Coordinates) {
		throw new Error('not implemented')
	}

	hasIntersected(): boolean {
		throw new Error('not implemented')
	}
}
