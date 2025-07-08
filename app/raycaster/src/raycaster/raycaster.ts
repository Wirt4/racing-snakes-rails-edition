import { RaycasterInterface } from './interface';

class Raycaster implements RaycasterInterface {
	constructor(private resolution: number) { }


	getViewRays(viewerAngle: number): number[] {
		const rays: number[] = [];
		for (let i = 0; i < this.resolution; i++) {
			rays.push(-1);
		}
		return rays;
	}
}

export { Raycaster };
