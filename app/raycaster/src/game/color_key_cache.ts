import { ColorName } from './color/color_name';

export interface ColorKey {
	color: ColorName;
	intensity: number;
}


const keyCache = new Map<ColorName, Map<number, ColorKey>>();
export function getColorKey(color: ColorName, intensity: number): ColorKey {

	const rounded = Math.round(intensity * 100) / 100;

	if (!keyCache.has(color)) {
		keyCache.set(color, new Map());
	}
	const innerMap = keyCache.get(color)!;

	if (!innerMap.has(rounded)) {
		innerMap.set(rounded, { color, intensity: rounded });
	}
	return innerMap.get(rounded)!;
}
