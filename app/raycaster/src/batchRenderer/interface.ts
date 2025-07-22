import { BatchesInterface } from '../batches/interface';

interface BatchRendererInterface {
	renderSlices(): void;
	renderHUD(): void;
	batches: BatchesInterface
	clear(): void;
}

export { BatchRendererInterface }
