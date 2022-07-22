// The colourprovider serves colours to the stars view. It keeps track of the different cultures
// that have been selected and assigns them a colour for their edges.
// Colours are served in the RGBa format, to be consistent with the choice for RGBa made
import PropTypes from 'prop-types';
import palettes from './palettes.js';

export default class ColourProvider {
    constructor() {
        const paletteName = localStorage.getItem('palette').toLowerCase();
        const darkMode = localStorage.getItem('darkMode') === 'true';

        this.darkMode = darkMode;
        this.palette = palettes[darkMode ? 'dark' : 'bright'][paletteName];
        this.paletteSize = this.palette.colours.length;
        this.edgePalette = {};
        this.availableColours = [...this.palette.colours];
    }

    isDark() {
        return this.darkMode;
    }

    /**
     * Resets the colourprovider to the first colour of the palette
     */
    resetColourProvider() {
        this.edgePalette = {};
        this.availableColours = [...this.palette.colours];
    }

    showEdgeColours() {
        let allColour = true;
        Object.values(this.edgePalette).forEach((colour) => {
            if (!colour) {
                allColour = false;
            }
        });
        return allColour;
    }

    getEdgeColour(culture) {
        return this.edgePalette[culture];
    }

    getEdgePalette() {
        return this.edgePalette;
    }

    addEdge(culture) {
        this.edgePalette[culture] = this.availableColours.shift();
    }

    removeEdge(culture) {
        this.availableColours.push(this.edgePalette[culture]);
        delete this.edgePalette[culture];

        // It may be that this allows another culture to assume colour
        if (this.availableColours.length === 1) {
            Object.entries(this.edgePalette).forEach(([cultureName, colour]) => {
                if (!colour) {
                    this.addEdge(cultureName);
                }
            });
        }
    }

    /**
     * Returns the RGBa colour code for the stars in this scheme
     * @returns {string} RGBa
     */
    getStarColour() {
        return this.palette.star;
    }

    /**
     * Returns the RGBa colour code for the background in this scheme
     * @returns {string} RGBa
     */
    getBackgroundColour() {
        return this.palette.background;
    }

    /**
     * Returns the RGBa colour code for the text in this scheme
     */
    getColor() {
        return this.palette.color.enabled;
    }

    /**
     * Returns the RGBa colour code for the enabled text in this scheme
     */
    getEnabledColor() {
        return this.palette.color.enabled;
    }

    /**
     * Returns the RGBa colour code for the disabled text in this scheme
     */
    getDisabledColor() {
        return this.palette.color.disabled;
    }

    /**
     * Returns the RGBa colour code for the sidebar in this scheme
     */
    getSidebarColour() {
        return this.palette.sidebar;
    }

    /**
     * Returns the RGBa colour code for the border of divs/bars in this scheme
     */
    getBorderColour() {
        return this.palette.border;
    }

    getPaletteSize() {
        return this.paletteSize;
    }

    static getPaletteIDS() {
        return Object.keys(palettes.dark);
    }

    static getPaletteNames() {
        return Object.values(palettes.dark).map(({ name }) => name);
    }
}

ColourProvider.propTypes = {
    paletteName: PropTypes.string,
    darkMode: PropTypes.bool,
};
