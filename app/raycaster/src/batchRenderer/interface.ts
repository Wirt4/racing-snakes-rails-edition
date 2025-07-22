import { BatchesInterface } from '../batches/interface';

interface BatchRendererInterface {
	renderSlices(): void;
	renderHUD(): void;
	batches: BatchesInterface
}

export { BatchRendererInterface }
