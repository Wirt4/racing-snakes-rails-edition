const cosCache = new Map();
const sinCache = new Map();
const rootCache = new Map();
class BMath {
    constructor(decimalPlaces) {
        this.decimalPlaces = decimalPlaces;
    }
    static getInstance(decimalPlaces = 6) {
        if (!BMath.instance) {
            BMath.instance = new BMath(decimalPlaces);
        }
        return BMath.instance;
    }
    cos(x) {
        return this.getCachedValue(cosCache, x, Math.cos);
    }
    sin(x) {
        return this.getCachedValue(sinCache, x, Math.sin);
    }
    sqrt(x) {
        return this.getCachedValue(rootCache, x, Math.sqrt);
    }
    //only for testing, don't use this in production code
    static _reset() {
        this.instance = null;
        cosCache.clear();
        sinCache.clear();
        rootCache.clear();
    }
    getCachedValue(cache, key, f) {
        const in_key = this.roundToPlaces(key);
        if (cache.has(in_key)) {
            return cache.get(in_key);
        }
        cache.set(in_key, this.roundToPlaces(f(key)));
        return cache.get(in_key);
    }
    roundToPlaces(num) {
        const factor = Math.pow(10, this.decimalPlaces);
        return Math.round(num * factor) / factor;
    }
}
BMath.instance = null;
export { BMath };
