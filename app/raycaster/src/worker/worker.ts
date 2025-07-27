import { MessageRouter } from '../messageRouter/messageRouter'
import { GameFacadeInterface } from '../gameFacade/interface';
import { GameFacadeFactory } from '../gameFacade/factory';
import { Directions } from '../controls/directions';
let gameFacade: GameFacadeInterface;

const router = new MessageRouter({
	init(msg) {
		gameFacade = GameFacadeFactory(msg.settings, msg.canvas);
		gameFacade.startLoop();
	},
	turn(msg) {
		if (!gameFacade) return;
		if (msg.direction === Directions.LEFT) gameFacade.turnLeft();
		else if (msg.direction === Directions.RIGHT) gameFacade.turnRight();
	},
})

onmessage = (e) => { router.handleMessage(e) };

