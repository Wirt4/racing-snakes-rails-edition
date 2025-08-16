import { nameToProfile } from '../color/color_profiles';
import { HSL } from './hsl';
export function hslFactory(colorName) {
    const { hue, saturation, lightness } = nameToProfile(colorName);
    return new HSL(hue, saturation, lightness);
}
