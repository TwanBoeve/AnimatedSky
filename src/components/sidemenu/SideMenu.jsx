import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './sidemenu.css';
import Cultures from './cultures/Cultures';
import Presets from './presets/Presets';
import ColourProvider from '../../utils/colourProvider/ColourProvider.js';

export default function SideMenu(props) {
    const {
        colourProvider,
        cultures: canvasCultures,
        setCultures: setAppCultures,
        allCultures,
        removeCulture: removeCultureFromCanvas,
        enableCulture,
        disableCulture,
        presets,
        setPresets,
        enablePreset,
        removePreset,
        selectedPreset,
    } = props;

    const [cultures, setCultures] = useState(canvasCultures);

    return (
        <div
            className="side-menu"
            style={{
                borderRight: `1px solid ${colourProvider.getBorderColour()}`,
                background: colourProvider.getSidebarColour(),
                color: colourProvider.getColor(),
            }}
        >
            <Cultures
                colourProvider={colourProvider}
                listedCultures={cultures}
                cultures={allCultures}
                setCultures={(newCultures) => {
                    setAppCultures(newCultures);
                    setCultures(newCultures);
                }}
                removeCulture={(culture) => {
                    setCultures(
                        cultures.filter(
                            ({ culture: elementCulture }) => elementCulture !== culture
                        )
                    );
                    _.debounce(() => {
                        removeCultureFromCanvas(culture);
                    }, 0)();
                }}
                enableCulture={enableCulture}
                disableCulture={disableCulture}
            />
            <Presets
                colourProvider={colourProvider}
                listedCultures={cultures}
                cultures={allCultures}
                presets={presets}
                setPresets={setPresets}
                enablePreset={enablePreset}
                removePreset={removePreset}
                selectedPreset={selectedPreset}
            />
        </div>
    );
}

SideMenu.propTypes = {
    colourProvider: PropTypes.instanceOf(ColourProvider).isRequired,
    allCultures: PropTypes.arrayOf(PropTypes.string).isRequired,
    cultures: PropTypes.arrayOf(
        PropTypes.shape({
            culture: PropTypes.string,
            enabled: PropTypes.bool,
        })
    ).isRequired,
    setCultures: PropTypes.func.isRequired,
    removeCulture: PropTypes.func.isRequired,
    enableCulture: PropTypes.func.isRequired,
    disableCulture: PropTypes.func.isRequired,
    presets: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            cultures: PropTypes.arrayOf(
                PropTypes.shape({
                    culture: PropTypes.string,
                    enabled: PropTypes.bool,
                })
            ).isRequired,
        })
    ).isRequired,
    setPresets: PropTypes.func.isRequired,
    enablePreset: PropTypes.func.isRequired,
    removePreset: PropTypes.func.isRequired,
    selectedPreset: PropTypes.string.isRequired,
};
