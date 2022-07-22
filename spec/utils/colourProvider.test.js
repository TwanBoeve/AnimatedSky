import ColourProvider from '../../src/utils/colourProvider/ColourProvider.js';

describe('The colourprovider test suite', () => {
    it('asks for the next edge colour', () => {
        const colourProvider = new ColourProvider();

        // Disable no duplicate string as colour palettes are very similar by character
        // eslint-disable-next-line sonarjs/no-duplicate-string
        expect(colourProvider.getNextEdgeColour()).toBe('rgba(225,76,31,100)');
        expect(colourProvider.getNextEdgeColour()).not.toBe(
            'rgba(225,76,31,100)'
        );
        expect(colourProvider.getNextEdgeColour()).toBe('rgba(250,206,58,100)');
        colourProvider.getNextEdgeColour();
        colourProvider.getNextEdgeColour();
        colourProvider.getNextEdgeColour();
        colourProvider.getNextEdgeColour();
        colourProvider.getNextEdgeColour();
        colourProvider.getNextEdgeColour();
        colourProvider.getNextEdgeColour();
        colourProvider.getNextEdgeColour();
        expect(colourProvider.getNextEdgeColour()).toBe(
            'rgba(125,138,149,100)'
        );
        expect(colourProvider.getNextEdgeColour()).toBe('rgba(225,76,31,100)');
    });
});

describe('Sees whether the palettes are properly listed', () => {
    it('There are 5 palettes provided by default', () => {
        expect(ColourProvider.getPaletteIDS().length).toEqual(5);
        expect(ColourProvider.getPaletteNames().length).toEqual(5);
    });
});
