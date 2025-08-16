import { ColorName } from './color_name';
/**
 * hue is a number between 0 and 360
 * saturation and lightness are numbers between 0 and 100
 */
function nameToProfile(color_label) {
    switch (color_label) {
        case ColorName.YELLOW:
            return { hue: 70, saturation: 1, lightness: .65 };
        case ColorName.BLUE:
            return { hue: 200, saturation: 1, lightness: .55 };
        case ColorName.RED:
            return { hue: 0, saturation: 1, lightness: .6 };
        case ColorName.GREEN:
            return { hue: 120, saturation: 1, lightness: .5 };
        case ColorName.WHITE:
            return { hue: 330, saturation: 1, lightness: .55 };
        case ColorName.BLACK:
            return { hue: 270, saturation: 1, lightness: .8 };
        case ColorName.PURPLE:
            return { hue: 280, saturation: 1, lightness: .6 };
        case ColorName.ORANGE:
            return { hue: 20, saturation: 1, lightness: .6 };
        default:
            throw new Error(`Unknown color label: ${color_label}`);
    }
}
export { nameToProfile };
