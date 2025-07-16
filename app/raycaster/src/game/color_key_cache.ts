import { ColorName } from './color/color_name';

export interface ColorKey {
	color: ColorName;
	intensity: number;
}

const keyCache = new Map<string, ColorKey>();

export function getColorKey(color: ColorName, intensity: number): ColorKey {
	const key = `${color}:${intensity}`;
	if (!keyCache.has(key)) {
		keyCache.set(key, { color, intensity });
	}
	return keyCache.get(key)!;
}
