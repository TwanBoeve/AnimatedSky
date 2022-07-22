import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    nl: {
        translation: {
            Cultures: 'Culturen',
            Presets: 'Configuraties',
            Stars: 'Sterren',
            Settings: 'Instellingen',
            Return: 'Terug',
            Language: 'Taal',
            ColourPalette: 'Kleurenpalet',
            SelectLanguage: 'Selecteer een taal',
            SelectDarkMode: 'Donkere modus',
            ImportExport:
                'Importeer of exporteer huidige instellingen en culturen.',
            Import: 'Importeren',
            Export: 'Exporteren',
            Dutch: 'Nederlands',
            English: 'Engels',
            Default: 'Standaard',
            Monochromacy: 'Monochromie',
            Deuteranopia: 'Deuteranopia',
            Tritanopia: 'Tritanopia',
            Protanopia: 'Protanopie',
            NotIncludedHidden: 'Sterren buiten sterrenbeelden verbergen',
            NotIncludedSmaller: 'Sterren buiten sterrenbeelden verkleinen',
            NotIncludedTransparent: 'Sterren buiten sterrenbeelden vervagen',
            Add: 'Toevoegen',
            UnnamedStar: '<Naamloze Ster>',
            Close: 'Sluiten',
            SelectCultures: 'Selecteer Culturen',
            AddPreset: 'Voeg Preset Toe',
            SearchCultures: 'Zoek Culturen',
            Listed: 'In Lijst',
            Selected: 'Geselecteerd',
            Name: 'Naam',
            SaveCurrentConfig: 'Sla Huidige Instellingen Op',
            Save: 'Sla Op',
            PresetOverview: 'Preset Overzicht',
            'Arabic (Al-Sufi)': 'Arabisch (Al-Sufi)',
            'Arabic (Ancient)': 'Arabisch (Klassiek)',
            'Arabic (Arabian Peninsula)': 'Arabisch (Arabisch eiland)',
            'Arabic (Lunar Stations)': 'Arabisch (Maanstations)',
            Aztec: 'Azteeks',
            Belarusian: 'Wit-Russisch',
            Blackfoot: 'Zwartvoet',
            Boorong: 'Borong',
            Chinese: 'Chinees',
            'Chinese Contemporary': 'Chinees (Modern)',
            Egyptian: 'Egyptisch',
            Hawaiian: 'Hawaiiaans',
            'Indian Vedic': 'Indisch (Vedisch)',
            'Japanese Lunar Stations': 'Japans (Maanstations)',
            Korean: 'Koreaans',
            Lokono: 'Lokono/Arawak',
            Macedonian: 'Macedonisch',
            Mandar: 'Mandarijn',
            Mongolian: 'Mongools',
            Norse: 'Noors',
            'Northern Andes': 'Noordelijke Andes',
            Ojibwe: 'Objiweg',
            Romanian: 'Roemeens',
            Sami: 'Samen',
            Sardinian: 'Sardinisch',
            Siberian: 'Siberisch',
            Tongan: 'Tongaans',
            Tukano: 'Tucaans',
            Western: 'Westers',
            'Western (H.A.Rey)': 'Westers (H.A.Rey)',
            'Western (O.Hlad)': 'Westers (O.Hlad)',
            'Western (Sky & Telescope)': 'Westers (Hemel & Telescoop)',
            GapWidth: 'Grootte ruimte tussen lijnen',
            EdgeWidth: 'Lijndikte tussen sterren',
            EdgeOffset: 'Afstand tot ster van lijn',
        },
    },
    en: {
        translation: {
            Cultures: 'Cultures',
            Presets: 'Presets',
            Stars: 'Stars',
            Settings: 'Settings',
            Return: 'Return',
            Language: 'Language',
            ColourPalette: 'Colour Palette',
            SelectLanguage: 'Select a language',
            SelectDarkMode: 'Dark mode',
            ImportExport: 'Import or export current settings and cultures.',
            Import: 'Import',
            Export: 'Export',
            Dutch: 'Dutch',
            English: 'English',
            Default: 'Default',
            Monochromacy: 'Monochromacy',
            Deuteranopia: 'Deuteranopia',
            Tritanopia: 'Tritanopia',
            Protanopia: 'Protanopia',
            NotIncludedHidden: 'Stars not included in constellations hidden',
            NotIncludedSmaller: 'Stars not included in constellations smaller',
            NotIncludedTransparent: 'Stars not included in constellations transparent',
            Add: 'Add',
            UnnamedStar: '<Unnamed Star>',
            Close: 'Close',
            SelectCultures: 'Select Cultures',
            AddPreset: 'Add Preset',
            SearchCultures: 'Search Cultures',
            Listed: 'Listed',
            Selected: 'Selected',
            Name: 'Name',
            SaveCurrentConfig: 'Save Current Configuration',
            Save: 'Save',
            PresetOverview: 'Preset Overview',
            GapWidth: 'Gap size between lines',
            EdgeWidth: 'Size of lines between stars',
            EdgeOffset: 'Line offset from star',
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: localStorage.getItem('lang') || 'en', // default English,
    inerpolation: {
        escapeValue: false,
    },
});

export default i18n;