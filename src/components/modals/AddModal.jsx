import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import GeneralModal from './GeneralModal';
import ColourProvider from '../../utils/colourProvider/ColourProvider.js';
import './addModal.css';
import DataProvider from '../../utils/dataProvider/DataProvider.js';

export default function AddModal(props) {
    const {
        cancel,
        confirm: completeForm,
        colourProvider,
        isVisible,
        title,
        cultures: allCultures,
        listedCultures,
        addPreset,
        presets,
    } = props;

    if (!isVisible) {
        return null;
    }

    const color = colourProvider.getColor();
    const borderColor = colourProvider.getBorderColour();
    const sidebarColour = colourProvider.getSidebarColour();

    const cultureObject = {};
    listedCultures.forEach(({ culture, enabled }) => {
        cultureObject[culture] = {
            listed: true,
            enabled,
        };
    });

    const correctedCultures = {};
    allCultures.forEach((culture) => {
        if (!cultureObject[culture]) {
            correctedCultures[culture] = {
                listed: false,
                enabled: false,
            };
        } else {
            correctedCultures[culture] = {
                listed: true,
                enabled: cultureObject[culture].enabled,
            };
        }
    });

    const [cultures, setCultures] = useState(correctedCultures);
    const [presetName, setPresetName] = useState('');

    const searchCulture = ({ target: { value: start } }) => {
        const newCultures = {};
        const criteria = start.toLowerCase();
        Object.entries(correctedCultures).forEach(
            ([culture, { enabled, listed }]) => {
                const namedCulture = DataProvider.getNamedCulture(culture).toLowerCase();
                if (namedCulture.startsWith(criteria)) {
                    newCultures[culture] = { enabled, listed };
                }
            }
        );
        setCultures(newCultures);
    };

    const toggleSelectCulture = ({ target: { value: culture } }) => {
        const newCultures = { ...cultures };
        const { enabled } = cultures[culture];
        newCultures[culture].enabled = !enabled;
        newCultures[culture].listed = true;
        setCultures(newCultures);
    };

    const toggleListCulture = ({ target: { value: culture } }) => {
        const newCultures = { ...cultures };
        const { listed } = cultures[culture];
        newCultures[culture].listed = !listed;
        if (listed) {
            newCultures[culture].enabled = false;
        }

        setCultures(newCultures);
    };

    const changePresetName = ({ target: { value: start } }) => {
        setPresetName(start);
    };

    const { t } = useTranslation();

    const confirm = () => {
        if (addPreset) {
            if (!presetName) {
                return;
            }

            const takenNames = presets.map(({ name }) => name);
            if (takenNames.includes(presetName)) {
                return;
            }
        }

        const newCultures = [];
        Object.entries({ ...correctedCultures, ...cultures }).forEach(
            ([culture, { enabled, listed }]) => {
                if (listed) {
                    newCultures.push({ culture, enabled });
                }
            }
        );
        completeForm(newCultures, presetName);
        cancel();
    };

    return (
        <GeneralModal
            close={addPreset ? cancel : confirm}
            confirm={confirm}
            colourProvider={colourProvider}
            isVisible={isVisible}
        >
            <span className="title">{title}</span>
            {addPreset ? (
                <input
                    className="input-bar"
                    type="text"
                    placeholder={t('Name')}
                    style={{ color: borderColor, backgroundColor: color }}
                    onChange={_.debounce(changePresetName, 100)}
                />
            ) : undefined}
            <input
                className="input-bar"
                type="text"
                placeholder={t('SearchCultures')}
                style={{ color: borderColor, backgroundColor: color }}
                onChange={_.debounce(searchCulture, 100)}
            />
            <div className="indicators">
                <span>{t('Selected')}</span>
                <span>{t('Listed')}</span>
            </div>
            <div className="culture-lister">
                <div className="cultures">
                    {Object.entries(cultures).map(
                        ([culture, { listed, enabled }], i) => (
                            <>
                                <div
                                    className="option-wrapper"
                                    key={`option-${culture}`}
                                >
                                    <div className="option">
                                        {DataProvider.getNamedCulture(culture)}
                                    </div>
                                    <div className="checkboxes-wrapper">
                                        <div className="checkbox-wrapper">
                                            <input
                                                type="checkbox"
                                                value={culture}
                                                checked={listed}
                                                onChange={toggleListCulture}
                                            />
                                        </div>
                                        <div className="checkbox-wrapper">
                                            <input
                                                type="checkbox"
                                                value={culture}
                                                checked={enabled}
                                                onChange={toggleSelectCulture}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {i !== Object.values(cultures).length - 1 ? (
                                    <hr style={{ backgroundColor: color }} />
                                ) : undefined}
                            </>
                        )
                    )}
                </div>
            </div>
            <div className="modal-buttons-wrapper">
                <button
                    type="submit"
                    style={{
                        border: `1px solid ${borderColor}`,
                        backgroundColor: color,
                        color: borderColor,
                    }}
                    onClick={confirm}
                >
                    Confirm
                </button>
                <button
                    type="submit"
                    style={{
                        border: `1px solid ${color}`,
                        backgroundColor: sidebarColour,
                    }}
                    onClick={cancel}
                >
                    Cancel
                </button>
            </div>
        </GeneralModal>
    );
}

AddModal.propTypes = {
    colourProvider: PropTypes.instanceOf(ColourProvider).isRequired,
    isVisible: PropTypes.bool.isRequired,
    cancel: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
    title: PropTypes.string,
    cultures: PropTypes.arrayOf(PropTypes.string).isRequired,
    listedCultures: PropTypes.arrayOf(
        PropTypes.shape({
            culture: PropTypes.string,
            enabled: PropTypes.bool,
        })
    ).isRequired,
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
    ),
    addPreset: PropTypes.bool,
};

AddModal.defaultProps = {
    title: undefined,
    addPreset: false,
    presets: [],
};
