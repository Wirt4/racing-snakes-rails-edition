import { ColorName } from '../color/color_name';
import { nameToProfile } from '../color/color_profiles';
import { HSL } from './hsl';

export function hslFactory(colorName: ColorName): HSL {
	const { hue, saturation, lightness } = nameToProfile(colorName);
	return new HSL(hue, saturation, lightness)
}
