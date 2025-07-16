import { ColorName } from './color/color_name';

export interface ColorKey {
	color: ColorName;
	intensity: number;
}

const keyCache = new Map<number, ColorKey>();

function hashColorKey(color: any, intensity: number): number {
	const quant = Math.round(intensity * 100); // 0–100
	return (color << 8) | quant;
}

export function getColorKey(color: ColorName, intensity: number): ColorKey {
	const key = hashColorKey(color, intensity);
	if (!keyCache.has(key)) {
		keyCache.set(key, { color, intensity });
	}
	return keyCache.get(key)!;
}
