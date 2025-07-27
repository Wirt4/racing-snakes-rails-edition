import { Directions } from '../controls/directions';

interface DirectionMessengerInterface {
	sendTurn(direcion: Directions): void;
}

export { DirectionMessengerInterface }
