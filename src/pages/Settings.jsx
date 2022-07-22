import React from 'react';
import { Link } from 'react-router-dom';
import './settings.css';

import Dropdown from '../components/forms/generalDropdown/GeneralDropdown';
import Switch from '../components/forms/generalSwitch/GeneralSwitch';
import Slider from '../components/forms/generalSlider/GeneralSlider';
import i18n from '../i18n.js';
import Icon from '../components/icons/Icon';
import ColourProvider from '../utils/colourProvider/ColourProvider.js';

const languageOptions = [
    { id: 'en', label: 'English' },
    { id: 'nl', label: 'Dutch' },
];

const paletteOptions = [
    { id: 'default', label: 'Default' },
    { id: 'monochromatic', label: 'Monochromacy' },
    { id: 'deuteranopia', label: 'Deuteranopia' },
    { id: 'tritanopia', label: 'Tritanopia' },
    { id: 'protanopia', label: 'Protanopia' },
];

export default class Settings extends React.Component {
    static findLabelFromArray(id, array) {
        return array.filter(({ id: elemId }) => id === elemId)[0].label;
    }

    static checkJsonFile(f) {
        return (
            // TODO: Make variables instead of hardcoded lists
            ['en', 'nl'].includes(f.settings.language)
            && [
                'default',
                'monochromatic',
                'deuteranopia',
                'tritanopia',
                'protanopia',
            ].includes(f.settings.palette)
            && typeof f.presets === 'string'
            && typeof f.cultures === 'string'
        );
    }

    static setGapWidth(value) {
        localStorage.setItem('gapWidth', value);
    }

    static setEdgeWidth(value) {
        localStorage.setItem('edgeWidth', value);
    }

    static setEdgeOffset(value) {
        localStorage.setItem('edgeOffset', value);
    }

    constructor(props) {
        super(props);
        this.state = {
            language: localStorage.getItem('language') || 'en',
            palette: localStorage.getItem('palette') || 'default',
            // TODO: fix a bug where reloading the settings page without cookies breaks
            //  -> IF needed, they should have been set at this point anyway
            isDarkMode: localStorage.getItem('darkMode') === 'true',
            notIncludedHidden:
                localStorage.getItem('notIncludedHidden') === 'true',
            notIncludedSmaller:
                localStorage.getItem('notIncludedSmaller') === 'true',
            notIncludedTransparent:
                localStorage.getItem('notIncludedTransparent') === 'true',
        };

        this.gapWidth = parseInt(localStorage.getItem('gapWidth'), 10) || 10;
        this.edgeWidth = parseInt(localStorage.getItem('edgeWidth'), 10) || 10;
        this.edgeOffset = parseInt(localStorage.getItem('edgeOffset'), 10) || 30;

        this.colourProvider = new ColourProvider();
    }

    setLanguage(id) {
        localStorage.setItem('language', id);
        this.setState({
            language: id,
        });
        i18n.changeLanguage(id);
        this.forceUpdate();
    }

    setColourPalette(id) {
        localStorage.setItem('palette', id);
        this.colourProvider = new ColourProvider();

        this.setState({
            palette: id,
        });
    }

    toggleDarkMode() {
        const { isDarkMode } = this.state;
        localStorage.setItem('darkMode', !isDarkMode);
        this.colourProvider = new ColourProvider();

        this.setState({ isDarkMode: !isDarkMode });
    }

    toggleNotIncludedHidden() {
        const { notIncludedHidden } = this.state;
        localStorage.setItem('notIncludedHidden', !notIncludedHidden);
        this.setState({ notIncludedHidden: !notIncludedHidden });
    }

    toggleNotIncludedSmaller() {
        const { notIncludedSmaller } = this.state;
        localStorage.setItem('notIncludedSmaller', !notIncludedSmaller);
        this.setState({ notIncludedSmaller: !notIncludedSmaller });
    }

    toggleNotIncludedTransparent() {
        const { notIncludedTransparent } = this.state;
        localStorage.setItem('notIncludedTransparent', !notIncludedTransparent);
        this.setState({ notIncludedTransparent: !notIncludedTransparent });
    }

    exportSettings() {
        const { language, palette, isDarkMode } = this.state;
        const a = document.createElement('a');
        const cultures = localStorage.getItem('cultures');
        const presets = localStorage.getItem('presets');
        a.href = URL.createObjectURL(
            new Blob(
                [
                    JSON.stringify({
                        settings: {
                            language,
                            palette,
                            isDarkMode,
                        },
                        cultures,
                        presets,
                    }),
                ],
                {
                    type: 'application/json',
                }
            )
        );
        a.download = 'export.json';
        a.click();
    }

    importSettings() {
        // TODO: give some feedback (modal?) that the import went through
        const [file] = document.querySelector('input[type=file]').files;
        const fr = new FileReader();
        fr.onload = (e) => {
            const content = JSON.parse(e.target.result);
            if (Settings.checkJsonFile(content)) {
                this.setLanguage(content.settings.language);
                this.setColourPalette(content.settings.palette);
                if (
                    localStorage.getItem('isDarkMode')
                    !== content.settings.isDarkMode
                ) {
                    this.toggleDarkMode();
                    // TODO: change the Switch element too, it now remains in its position
                }
                if (content.cultures !== undefined) {
                    localStorage.setItem('cultures', content.cultures);
                }
                if (content.presets !== undefined) {
                    localStorage.setItem('presets', content.presets);
                }
            }
        };
        fr.readAsText(file);
    }

    render() {
        const {
            language,
            palette,
            isDarkMode,
            notIncludedHidden,
            notIncludedSmaller,
            notIncludedTransparent,
        } = this.state;

        const { gapWidth, edgeWidth, edgeOffset } = this;

        const { colourProvider } = this;
        const sidebarColour = colourProvider.getSidebarColour();
        const backgroundColor = colourProvider.getBackgroundColour();
        const color = colourProvider.getColor();

        return (
            <div className="settings" style={{ backgroundColor, color }}>
                <div className="title-bar">
                    <Link to="/">
                        <Icon
                            className="return-arrow"
                            icon="arrowBack"
                            colourProvider={colourProvider}
                            alt={i18n.t('Return')}
                        />
                        <span className="title" style={{ color }}>
                            {i18n.t('Settings')}
                        </span>
                    </Link>
                </div>
                <div className="options">
                    <Dropdown
                        label={i18n.t('Language')}
                        options={languageOptions}
                        colourProvider={colourProvider}
                        selectedValue={Settings.findLabelFromArray(
                            language,
                            languageOptions
                        )}
                        onSelect={(option) => {
                            this.setLanguage(option);
                        }}
                    />
                    <Dropdown
                        label={i18n.t('ColourPalette')}
                        options={paletteOptions}
                        colourProvider={colourProvider}
                        selectedValue={Settings.findLabelFromArray(
                            palette,
                            paletteOptions
                        )}
                        onSelect={(option) => {
                            this.setColourPalette(option);
                        }}
                    />
                    <hr style={{ backgroundColor: color }} />
                    <Slider
                        label={i18n.t('GapWidth')}
                        initialValue={gapWidth}
                        minValue={1}
                        maxValue={10}
                        onChange={(value) => {
                            Settings.setGapWidth(value);
                        }}
                        colourProvider={colourProvider}
                    />
                    <Slider
                        label={i18n.t('EdgeWidth')}
                        initialValue={edgeWidth}
                        minValue={1}
                        maxValue={10}
                        onChange={(value) => {
                            Settings.setEdgeWidth(value);
                        }}
                        colourProvider={colourProvider}
                    />
                    <Slider
                        label={i18n.t('EdgeOffset')}
                        initialValue={edgeOffset}
                        minValue={0}
                        maxValue={50}
                        onChange={(value) => {
                            Settings.setEdgeOffset(value);
                        }}
                        colourProvider={colourProvider}
                    />
                    <hr style={{ backgroundColor: color }} />
                    <Switch
                        label={i18n.t('SelectDarkMode')}
                        isChecked={isDarkMode}
                        onChange={() => {
                            this.toggleDarkMode();
                        }}
                    />
                    <Switch
                        label={i18n.t('NotIncludedHidden')}
                        isChecked={notIncludedHidden}
                        onChange={() => {
                            this.toggleNotIncludedHidden();
                        }}
                    />
                    <Switch
                        label={i18n.t('NotIncludedSmaller')}
                        isChecked={notIncludedSmaller}
                        onChange={() => {
                            this.toggleNotIncludedSmaller();
                        }}
                    />
                    <Switch
                        label={i18n.t('NotIncludedTransparent')}
                        isChecked={notIncludedTransparent}
                        onChange={() => {
                            this.toggleNotIncludedTransparent();
                        }}
                    />
                    <hr style={{ backgroundColor: color }} />
                    <div className="import-exporter">
                        <span>{i18n.t('ImportExport')}</span>
                        <div className="import-export-button-wrapper">
                            <label
                                className="file-uploader"
                                htmlFor="import-button"
                            >
                                <input
                                    type="file"
                                    className="import-button"
                                    accept="application/json"
                                    id="import-button"
                                    onChange={() => this.importSettings()}
                                />
                                <div
                                    className="action-button"
                                    style={{
                                        backgroundColor: sidebarColour,
                                        border: `1px solid ${color}`,
                                    }}
                                >
                                    {i18n.t('Import')}
                                </div>
                            </label>
                            <button
                                className="action-button"
                                style={{
                                    backgroundColor: sidebarColour,
                                    border: `1px solid ${color}`,
                                }}
                                type="submit"
                                onClick={() => {
                                    this.exportSettings();
                                }}
                            >
                                {i18n.t('Export')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
