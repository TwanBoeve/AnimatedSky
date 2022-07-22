import React from 'react';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.min.css';
import { Layout } from 'antd';
import classNames from 'classnames';
import i18n from '../i18n.js';
import SideMenu from '../components/sidemenu/SideMenu';
import Stars from '../components/stars/Stars';
import './app.css';
import Icon from '../components/icons/Icon';
import ColourProvider from '../utils/colourProvider/ColourProvider.js';
import DataProvider from '../utils/dataProvider/DataProvider.js';

const { Sider, Content } = Layout;

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.darkMode = localStorage.getItem('darkMode') === 'true'; // default true
        this.paletteName = localStorage.getItem('palette') || 'default'; // default 'default'
        this.language = localStorage.getItem('language') || 'en'; // default 'en' for English
        this.notIncludedHidden = localStorage.getItem('notIncludedHidden') === 'true'; // default false
        this.notIncludedSmaller = (localStorage.getItem('notIncludedSmaller') === undefined) || (localStorage.getItem('notIncludedSmaller') === 'true'); // default true
        this.notIncludedTransparent = (localStorage.getItem('notIncludedTransparent') === undefined) || (localStorage.getItem('notIncludedTransparent') === 'true'); // default true
        let cultures = [
            {
                culture: 'belarusian',
                enabled: true,
            },
            // {
            //     culture: 'macedonian',
            //     enabled: true,
            // },
            // {
            //     culture: 'norse',
            //     enabled: true,
            // },
            {
                culture: 'romanian',
                enabled: true,
            },
            // {
            //     culture: 'sardinian',
            //     enabled: true,
            // },
            {
                culture: 'western',
                enabled: true,
            },
            // {
            //     culture: 'western_hlad',
            //     enabled: false,
            // },
            // {
            //     culture: 'western_rey',
            //     enabled: false,
            // },
            // {
            //     culture: 'western_SnT',
            //     enabled: false,
            // },
        ];
        if (localStorage.getItem('cultures')) {
            cultures = JSON.parse(localStorage.getItem('cultures'));
        }

        let presets = [
            {
                name: 'Western Cultures',
                cultures: [
                    {
                        culture: 'belarusian',
                        enabled: true,
                    },
                    {
                        culture: 'macedonian',
                        enabled: true,
                    },
                    {
                        culture: 'norse',
                        enabled: true,
                    },
                    {
                        culture: 'romanian',
                        enabled: true,
                    },
                    {
                        culture: 'sardinian',
                        enabled: true,
                    },
                    {
                        culture: 'western',
                        enabled: true,
                    },
                    {
                        culture: 'western_hlad',
                        enabled: false,
                    },
                    {
                        culture: 'western_rey',
                        enabled: false,
                    },
                    {
                        culture: 'western_SnT',
                        enabled: false,
                    },
                ],
            },
            {
                name: 'Asian Cultures',
                cultures: [
                    {
                        culture: 'arabic_al-sufi',
                        enabled: true,
                    },
                    {
                        culture: 'arabic_ancient',
                        enabled: false,
                    },
                    {
                        culture: 'arabic_arabian_peninsula',
                        enabled: false,
                    },
                    {
                        culture: 'arabic_lunar_stations',
                        enabled: false,
                    },
                    {
                        culture: 'chinese',
                        enabled: true,
                    },
                    {
                        culture: 'chinese_contemporary',
                        enabled: false,
                    },
                    {
                        culture: 'egyptian',
                        enabled: true,
                    },
                    {
                        culture: 'indian',
                        enabled: true,
                    },
                    {
                        culture: 'japanese_moon_stations',
                        enabled: true,
                    },
                    {
                        culture: 'korean',
                        enabled: true,
                    },
                    {
                        culture: 'mongolian',
                        enabled: true,
                    },
                ],
            },
        ];
        if (localStorage.getItem('presets')) {
            presets = JSON.parse(localStorage.getItem('presets'));
        }
        localStorage.setItem('darkMode', this.darkMode);
        localStorage.setItem('palette', this.paletteName);
        localStorage.setItem('language', this.language);
        localStorage.setItem('notIncludedHidden', this.notIncludedHidden);
        localStorage.setItem('notIncludedSmaller', this.notIncludedSmaller);
        localStorage.setItem('notIncludedTransparent', this.notIncludedTransparent);
        this.colourProvider = new ColourProvider();
        cultures.forEach(({ culture }) => {
            this.colourProvider.addEdge(culture);
        });
        this.state = {
            cultures,
            presets,
            collapsed: false,
            selectedPreset: '',
        };
    }

    setCultures(cultures) {
        this.colourProvider.resetColourProvider();
        cultures.forEach(({ culture }) => {
            this.colourProvider.addEdge(culture);
        });
        this.setState({ cultures }, () => this.culturesToCookies());
    }

    setPresets(presets) {
        this.setState({ presets }, () => this.presetsToCookies());
    }

    removeCulture(culture) {
        let { cultures } = this.state;
        cultures = cultures.filter(
            ({ culture: elemCulture }) => elemCulture !== culture
        );
        this.colourProvider.removeEdge(culture);

        this.setState({ cultures: [...cultures], selectedPreset: '' }, () => this.culturesToCookies());
    }

    enableCulture(culture) {
        const { cultures } = this.state;
        cultures.forEach(({ culture: elemCulture }, i) => {
            if (elemCulture === culture) {
                cultures[i].enabled = true;
            }
        });
        this.setState({ cultures, selectedPreset: '' }, () => this.culturesToCookies());
    }

    disableCulture(culture) {
        const { cultures } = this.state;
        cultures.forEach(({ culture: elemCulture }, i) => {
            if (elemCulture === culture) {
                cultures[i].enabled = false;
            }
        });
        this.setState({ cultures, selectedPreset: '' }, () => this.culturesToCookies());
    }

    culturesToCookies() {
        const { state } = this;
        const cults = JSON.stringify(state.cultures);
        localStorage.setItem('cultures', cults);
    }

    enablePreset(presetName) {
        let cultures = [];
        const { presets } = this.state;
        presets.forEach((preset) => {
            const { name, cultures: presetCultures } = preset;
            if (presetName === name) {
                cultures = presetCultures;
            }
        });
        this.colourProvider.resetColourProvider();
        cultures.forEach(({ culture }) => {
            this.colourProvider.addEdge(culture);
        });
        this.setState({ cultures, selectedPreset: presetName }, () => this.presetsToCookies());
    }

    removePreset(preset) {
        let { presets } = this.state;
        presets = presets.filter(
            ({ name: presetName }) => presetName !== preset
        );
        this.setState({ presets }, () => this.presetsToCookies());
    }

    presetsToCookies() {
        const { state } = this;
        const pres = JSON.stringify(state.presets);
        localStorage.setItem('presets', pres);
    }

    toggleMenu() {
        const { collapsed } = this.state;
        this.setState({
            collapsed: !collapsed,
        });
    }

    render() {
        const { cultures, collapsed, presets, selectedPreset } = this.state;
        const { colourProvider } = this;

        return (
            <>
                <Layout className="menu-wrapper">
                    <Sider
                        trigger={null}
                        collapsible
                        collapsed={collapsed}
                        collapsedWidth={0}
                        width={320}
                    >
                        <SideMenu
                            key={`cultures-${cultures}-presets-${presets}`}
                            colourProvider={colourProvider}
                            allCultures={DataProvider.listCultures()}
                            presets={presets}
                            cultures={cultures}
                            setCultures={(newCultures) => {
                                this.setCultures(newCultures);
                            }}
                            removeCulture={(culture) => {
                                this.removeCulture(culture);
                            }}
                            enableCulture={(culture) => {
                                this.enableCulture(culture);
                            }}
                            disableCulture={(culture) => {
                                this.disableCulture(culture);
                            }}
                            setPresets={(newPresets) => {
                                this.setPresets(newPresets, () => this.presetsToCookies());
                            }}
                            enablePreset={(preset) => {
                                this.enablePreset(preset, () => this.presetsToCookies());
                            }}
                            removePreset={(preset) => {
                                this.removePreset(preset, () => this.presetsToCookies());
                            }}
                            selectedPreset={selectedPreset}
                        />
                    </Sider>
                    <Content className="content">
                        <Stars
                            cultures={cultures}
                            colourProvider={colourProvider}
                        />
                        <button
                            type="submit"
                            id="sidebar-collapser"
                            className="sidebar-collapser"
                            onClick={() => {
                                this.toggleMenu();
                            }}
                            style={{
                                backgroundColor:
                                    colourProvider.getSidebarColour(),
                                border: `1px solid ${colourProvider.getBorderColour()}`,
                            }}
                        >
                            <Icon
                                colourProvider={colourProvider}
                                className={classNames({ collapsed })}
                                icon="arrowBack"
                                alt=""
                            />
                        </button>
                    </Content>
                </Layout>
                <Link to="/settings" className="settings-button">
                    <Icon
                        colourProvider={colourProvider}
                        icon="cog"
                        alt={i18n.t('Settings')}
                    />
                </Link>
            </>
        );
    }
}
