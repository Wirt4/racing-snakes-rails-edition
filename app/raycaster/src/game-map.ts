import { Player } from './player';
import { Wall } from './wall';
import { Renderer } from './renderer';

class GameMap {
	player: Player
	walls: Wall[]
	constructor(player: Player, walls: Wall[]) {
		this.player = player;
		this.walls = walls;
	}

	draw(renderer: Renderer): void {
		renderer.draw();
	}

	update(): void {
		// Update game state, e.g., player position, wall states, etc.
		// This method can be expanded based on game logic
	}
}

export { GameMap };
