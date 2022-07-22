import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import DataProvider from '../../../utils/dataProvider/DataProvider.js';
import ColourProvider from '../../../utils/colourProvider/ColourProvider.js';
import Icon from '../../icons/Icon';

export default function Culture(props) {
    const {
        culture,
        enabled,
        colourProvider,
        disableCulture,
        enableCulture,
        removeCulture,
        showColour,
        backgroundColor,
    } = props;

    const [isHover, setHover] = useState(false);
    const { t } = useTranslation();

    const name = DataProvider.getNamedCulture(culture);
    const color = (enabled || isHover)
        ? colourProvider.getEnabledColor()
        : colourProvider.getDisabledColor();
    const textDecoration = isHover && enabled ? 'line-through' : null;

    return (
        <div
            className="culture-wrapper"
            key={`culture-list-${culture}`}
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
                    'culture',
                    enabled ? 'enabled' : 'disabled'
                )}
                style={{ color, textDecoration }}
                onClick={() => {
                    if (enabled) {
                        disableCulture(culture);
                    } else {
                        enableCulture(culture);
                    }
                }}
            >
                {showColour ? (
                    <div
                        className="colour-indicator"
                        style={{
                            backgroundColor: enabled ? backgroundColor : null,
                        }}
                    />
                ) : null}
                <span>{t(name)}</span>
            </button>
            {isHover ? (
                <Icon
                    colourProvider={colourProvider}
                    className="remove-culture"
                    icon="cross"
                    alt=""
                    onClick={() => {
                        removeCulture(culture);
                    }}
                />
            ) : null}
        </div>
    );
}

Culture.propTypes = {
    culture: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    colourProvider: PropTypes.instanceOf(ColourProvider).isRequired,
    disableCulture: PropTypes.func.isRequired,
    enableCulture: PropTypes.func.isRequired,
    removeCulture: PropTypes.func.isRequired,
    showColour: PropTypes.bool.isRequired,
    backgroundColor: PropTypes.string,
};

Culture.defaultProps = {
    backgroundColor: '',
};
