export interface ArenaInterface {
	width: number;
	height: number;
	containsCoordinates(x: number, y: number): boolean;
}
