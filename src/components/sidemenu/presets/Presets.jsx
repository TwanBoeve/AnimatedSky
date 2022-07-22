import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Header from '../Header';
import ColourProvider from '../../../utils/colourProvider/ColourProvider.js';
import Preset from './Preset';
import AddModal from '../../modals/AddModal';
import PresetsModal from '../../modals/PresetsModal';

export default function Presets(props) {
    const {
        cultures,
        listedCultures,
        colourProvider,
        selectedPreset,
        presets,
        setPresets,
        enablePreset,
        removePreset,
    } = props;

    const [isAddModalVisible, setAddModalVisibility] = useState(false);
    const [isSaveModalVisible, setSaveModalVisibility] = useState(false);
    const [isSettingsModalVisible, setSettingsModalVisibility] = useState(false);

    const { t } = useTranslation();
    return (
        <div>
            <AddModal
                title={t('AddPreset')}
                isVisible={isAddModalVisible}
                presets={presets}
                cultures={cultures}
                cancel={() => {
                    setAddModalVisibility(false);
                }}
                confirm={(presetCultures, presetName) => {
                    setPresets([
                        ...presets,
                        { name: presetName, cultures: presetCultures },
                    ]);
                    setAddModalVisibility(false);
                }}
                listedCultures={[]}
                colourProvider={colourProvider}
                addPreset
            />
            <AddModal
                title={t('SaveCurrentConfig')}
                isVisible={isSaveModalVisible}
                presets={presets}
                cultures={cultures}
                cancel={() => {
                    setSaveModalVisibility(false);
                }}
                confirm={(presetCultures, presetName) => {
                    setPresets([
                        ...presets,
                        { name: presetName, cultures: presetCultures },
                    ]);
                    setSaveModalVisibility(false);
                }}
                listedCultures={listedCultures}
                colourProvider={colourProvider}
                addPreset
            />
            <PresetsModal
                title={t('PresetOverview')}
                presets={presets}
                setPresets={setPresets}
                cancel={() => {
                    setSettingsModalVisibility(false);
                }}
                confirm={(newPresets) => {
                    setPresets(newPresets);
                    setSettingsModalVisibility(false);
                }}
                colourProvider={colourProvider}
                isVisible={isSettingsModalVisible}
            />
            <Header
                colourProvider={colourProvider}
                title={t('Presets')}
                onAdd={() => setAddModalVisibility(true)}
                onSave={() => setSaveModalVisibility(true)}
                onSettings={() => setSettingsModalVisibility(true)}
            />
            <div className="list">
                {presets.map(({ name }) => (
                    <Preset
                        key={name}
                        name={name}
                        enablePreset={enablePreset}
                        removePreset={removePreset}
                        colourProvider={colourProvider}
                        selectedPreset={selectedPreset}
                    />
                ))}
            </div>
        </div>
    );
}

Presets.propTypes = {
    cultures: PropTypes.arrayOf(PropTypes.string).isRequired,
    listedCultures: PropTypes.arrayOf(
        PropTypes.shape({
            culture: PropTypes.string,
            enabled: PropTypes.bool,
        })
    ).isRequired,
    colourProvider: PropTypes.instanceOf(ColourProvider).isRequired,
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
