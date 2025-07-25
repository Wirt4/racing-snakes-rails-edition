import { ColorName } from '../color/color_name';

export interface ColorKey {
	color: ColorName;
	intensity: number;
}

const keyCache = new Map<ColorName, Map<number, ColorKey>>();

export function getColorKey(color: ColorName, intensity: number): ColorKey {
	const levels = 16;
	const rounded_key = Math.round(intensity * levels);

	if (!keyCache.has(color)) {
		keyCache.set(color, new Map());
	}
	const innerMap = keyCache.get(color)!;

	if (!innerMap.has(rounded_key)) {
		innerMap.set(rounded_key, { color, intensity: rounded_key / levels });
	}
	return innerMap.get(rounded_key)!;
}
