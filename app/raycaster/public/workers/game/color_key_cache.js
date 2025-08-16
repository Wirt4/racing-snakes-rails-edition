const keyCache = new Map();
function hashColorKey(color, intensity) {
    const quant = Math.round(intensity * 100); // 0–100
    return (color << 8) | quant;
}
export function getColorKey(color, intensity) {
    const key = hashColorKey(color, intensity);
    if (!keyCache.has(key)) {
        keyCache.set(key, { color, intensity });
    }
    return keyCache.get(key);
}
