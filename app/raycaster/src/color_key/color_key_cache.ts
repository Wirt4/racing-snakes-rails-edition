import { ColorName } from '../color/color_name';

export interface ColorKey {
	color: ColorName;
	intensity: number;
}

const keyCache = new Map<ColorName, Map<number, ColorKey>>();
/**
 * Returns a ColorKey object for the given color and intensity.
 * If the ColorKey already exists in the cache, it returns the cached version.
 * Otherwise, it creates a new ColorKey and stores it in the cache.
 *
 * @param color - The name of the color.
 * @param intensity - The intensity of the color (0 to 1).
 * @returns A ColorKey object containing the color name and intensity.
 */
export function getColorKey(color: ColorName, intensity: number): ColorKey {

	const rounded_key = Math.round(intensity * 16);

	if (!keyCache.has(color)) {
		keyCache.set(color, new Map());
	}
	const innerMap = keyCache.get(color)!;

	if (!innerMap.has(rounded_key)) {
		innerMap.set(rounded_key, { color, intensity: rounded_key / 16 });
	}
	return innerMap.get(rounded_key)!;
}

export function logColorKeyCacheStats(): void {
	console.log('🧠 ColorKey Cache Stats');
	let total = 0;
	for (const [color, innerMap] of keyCache.entries()) {
		const count = innerMap.size;
		total += count;
		console.log(`  ${color}: ${count} entries`);
	}
	console.log(`  Total unique ColorKeys: ${total}`);
}
