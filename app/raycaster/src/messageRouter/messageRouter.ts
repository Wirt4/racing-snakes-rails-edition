import { MessageRouterInterface } from './interface';

class MessageRouter implements MessageRouterInterface {
	private handlers: Handlers
	constructor(mappings: Record<string, (formattedMessage: any) => void>) {
		this.handlers = new Handlers(mappings)
	}

	handleMessage(event: MessageEvent): void {
		this.handlers.setHandler(event.data.type)
		this.handlers.processEvent(event.data)
	}
}

class Handlers {
	private currentHandler: (message: any) => void
	private isValidHandler: boolean = false

	constructor(private mappings: Record<string, (message: any) => void>) {
		this.currentHandler = () => { throw ("not initialized") }
	}

	setHandler(handlerType: string): void {
		this.isValidHandler = !this.mappings[handlerType] ? false : true
		this.currentHandler = this.mappings[handlerType]
	}

	processEvent(eventData: any): void {
		if (this.isValidHandler) {
			this.currentHandler(eventData)
		} else {
			console.warn(`Unknown message type: ${eventData.type}`)
		}
	}
}

export { MessageRouter };

