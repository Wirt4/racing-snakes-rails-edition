import { MessageRouterInterface } from './interface';

class MessageRouter implements MessageRouterInterface {
	constructor(private handlers: Record<string, (formattedMessage: any) => void>) {
	}

	handleMessage(event: MessageEvent): void {
		const handler = this.handlers[event.data.type];
		handler(event.data);
	}
}

export { MessageRouter };

