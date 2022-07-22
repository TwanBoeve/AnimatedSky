import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Header from '../Header';
import ColourProvider from '../../../utils/colourProvider/ColourProvider.js';
import './cultures.css';
import Culture from './Culture';
import AddModal from '../../modals/AddModal';

export default function Cultures(props) {
    const {
        colourProvider,
        listedCultures,
        cultures,
        setCultures,
        removeCulture,
        enableCulture,
        disableCulture,
    } = props;

    const [isModalVisible, setModalVisibility] = useState(false);

    const showColour = colourProvider.showEdgeColours();

    const { t } = useTranslation();
    return (
        <>
            <AddModal
                cultures={cultures}
                listedCultures={listedCultures}
                title={t('SelectCultures')}
                colourProvider={colourProvider}
                isVisible={isModalVisible}
                cancel={() => {
                    setModalVisibility(false);
                }}
                confirm={(newCultures) => {
                    setCultures(newCultures);
                }}
            />
            <div>
                <Header
                    colourProvider={colourProvider}
                    title={t('Cultures')}
                    style={{ borderTop: null }}
                    onSettings={() => setModalVisibility(true)}
                />
                <div className="cultures list">
                    {listedCultures.map(({ culture, enabled }) => {
                        const backgroundColor = colourProvider.getEdgeColour(culture);
                        return (
                            <Culture
                                key={`culture-option-${culture}`}
                                culture={culture}
                                enabled={enabled}
                                colourProvider={colourProvider}
                                disableCulture={disableCulture}
                                enableCulture={enableCulture}
                                removeCulture={removeCulture}
                                showColour={showColour}
                                backgroundColor={backgroundColor}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
}

Cultures.propTypes = {
    colourProvider: PropTypes.instanceOf(ColourProvider).isRequired,
    cultures: PropTypes.arrayOf(PropTypes.string).isRequired,
    listedCultures: PropTypes.arrayOf(
        PropTypes.shape({
            culture: PropTypes.string,
            enabled: PropTypes.bool,
        })
    ).isRequired,
    setCultures: PropTypes.func.isRequired,
    removeCulture: PropTypes.func.isRequired,
    enableCulture: PropTypes.func.isRequired,
    disableCulture: PropTypes.func.isRequired,
};
