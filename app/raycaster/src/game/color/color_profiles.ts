import { ColorName } from './color_name';

interface HSLInterface {
	hue: number;
	saturation: number;
	lightness: number;
}
/**
 * hue is a number between 0 and 360
 * saturation and lightness are numbers between 0.0 and 1.0
 */

function nameToProfile(color_label: ColorName): HSLInterface {
	switch (color_label) {
		case ColorName.YELLOW:
			return { hue: 60, saturation: 1, lightness: 0.5 };
		case ColorName.BLUE:
			return { hue: 240, saturation: 1, lightness: 0.6 };
		case ColorName.RED:
			return { hue: 0, saturation: 1, lightness: 0.6 };
		case ColorName.GREEN:
			return { hue: 120, saturation: 1, lightness: 0.5 };
		case ColorName.WHITE:
			return { hue: 120, saturation: 0.01, lightness: 0.99 };
		case ColorName.BLACK:
			return { hue: 300, saturation: 0.01, lightness: 0.01 };
		case ColorName.PURPLE:
			return { hue: 270, saturation: 1, lightness: 0.5 };
		case ColorName.ORANGE:
			return { hue: 15, saturation: 0.10, lightness: 0.5 };
		default:
			throw new Error(`Unknown color label: ${color_label}`);
	}
}

export { HSLInterface, nameToProfile };
