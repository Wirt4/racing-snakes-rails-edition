
import { BatchesInterface } from '../batches/interface';

export interface BatchCorrelatorInterface {
	batchRenderData(): void;
	batches: BatchesInterface;
}
