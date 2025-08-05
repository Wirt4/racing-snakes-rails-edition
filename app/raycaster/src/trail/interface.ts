import { Coordinates } from '../geometry/interfaces'

export interface TrailInterface {
	add(coordinates: Coordinates): void
	hasIntersected(): boolean
}
