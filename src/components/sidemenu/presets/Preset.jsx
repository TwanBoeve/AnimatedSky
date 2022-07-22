import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ColourProvider from '../../../utils/colourProvider/ColourProvider.js';
import Icon from '../../icons/Icon';
import './presets.css';

export default function Preset(props) {
    const { name, enablePreset, removePreset, colourProvider, selectedPreset } = props;

    const [isHover, setHover] = useState(false);

    const enabled = name === selectedPreset;
    // eslint-disable-next-line max-len
    const color = enabled || isHover ? colourProvider.getEnabledColor() : colourProvider.getDisabledColor();
    const textDecoration = isHover && enabled ? 'line-through' : null;

    return (
        <div
            className="preset-wrapper"
            key={`preset-list-${name}`}
            onMouseEnter={() => {
                setHover(true);
            }}
            onMouseLeave={() => {
                setHover(false);
            }}
        >
            <button
                type="submit"
                className={classNames(
                    'preset',
                    enabled ? 'enabled' : 'disabled'
                )}
                style={{ color, textDecoration }}
                onClick={() => {
                    if (!enabled) {
                        enablePreset(name);
                    }
                }}
            >
                <span>{name}</span>
            </button>
            {isHover ? (
                <Icon
                    colourProvider={colourProvider}
                    className="remove-preset"
                    icon="cross"
                    alt=""
                    onClick={() => {
                        removePreset(name);
                    }}
                />
            ) : null}
        </div>
    );
}

Preset.propTypes = {
    colourProvider: PropTypes.instanceOf(ColourProvider).isRequired,
    name: PropTypes.string,
    enablePreset: PropTypes.func,
    removePreset: PropTypes.func,
    selectedPreset: PropTypes.string,
};

Preset.defaultProps = {
    name: '',
    enablePreset: undefined,
    removePreset: undefined,
    selectedPreset: '',
};
