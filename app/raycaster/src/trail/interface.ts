import { Coordinates } from '../geometry/interfaces'

export interface Trail {
	add(coordinates: Coordinates): void
	hasInterescted(): boolean
}
