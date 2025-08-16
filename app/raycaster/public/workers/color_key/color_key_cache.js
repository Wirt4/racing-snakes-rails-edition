const keyCache = new Map();
export function getColorKey(color, intensity) {
    const levels = 16;
    const rounded_key = Math.round(intensity * levels);
    if (!keyCache.has(color)) {
        keyCache.set(color, new Map());
    }
    const innerMap = keyCache.get(color);
    if (!innerMap.has(rounded_key)) {
        innerMap.set(rounded_key, { color, intensity: rounded_key / levels });
    }
    return innerMap.get(rounded_key);
}
