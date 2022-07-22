import React, { useState } from 'react';
import PropTypes from 'prop-types';
import GeneralModal from './GeneralModal';
import ColourProvider from '../../utils/colourProvider/ColourProvider.js';
import './presetsModal.css';
import Icon from '../icons/Icon';
import DataProvider from '../../utils/dataProvider/DataProvider.js';

export default function PresetsModal(props) {
    const {
        presets,
        cancel,
        confirm: completeForm,
        colourProvider,
        isVisible,
        title,
    } = props;

    if (!isVisible) {
        return null;
    }

    const color = colourProvider.getColor();
    const borderColor = colourProvider.getBorderColour();
    const sidebarColour = colourProvider.getSidebarColour();

    const [newPresets, setNewPresets] = useState(presets);

    const confirm = () => {
        completeForm(newPresets);
        cancel();
    };

    return (
        <GeneralModal
            close={confirm}
            colourProvider={colourProvider}
            isVisible={isVisible}
        >
            <span className="title">{title}</span>
            <div className="modal-preset-wrappers">
                {newPresets.map(({ name, cultures }) => (
                    <div className="modal-preset" key={`preset-${name}`}>
                        <div className="names">
                            <div className="preset-name">{name}</div>
                            <div className="preset-cultures">
                                {cultures.map(({ culture, enabled }) => {
                                    const cultureColor = enabled
                                        ? colourProvider.getEnabledColor()
                                        : colourProvider.getDisabledColor();

                                    return (
                                        <div
                                            className="preset-culture"
                                            style={{ color: cultureColor }}
                                        >
                                            {DataProvider.getNamedCulture(culture)}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <Icon
                            icon="cross"
                            colourProvider={colourProvider}
                            alt=""
                            onClick={() => {
                                setNewPresets(
                                    newPresets.filter(
                                        ({ name: presetName }) => presetName !== name
                                    )
                                );
                            }}
                        />
                    </div>
                ))}
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

PresetsModal.propTypes = {
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
    cancel: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
    colourProvider: PropTypes.instanceOf(ColourProvider).isRequired,
    isVisible: PropTypes.bool.isRequired,
    title: PropTypes.string,
};

PresetsModal.defaultProps = {
    title: '',
};
