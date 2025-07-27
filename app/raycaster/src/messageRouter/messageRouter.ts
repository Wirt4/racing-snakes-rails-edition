import { MessageRouterInterface } from './interface';

class MessageRouter implements MessageRouterInterface {
	constructor(private handlers: Record<string, (formattedMessage: any) => void>) {
	}

	handleMessage(message: MessageEvent): void {
		throw new Error('Method not implemented.');
	}
}

export { MessageRouter };

