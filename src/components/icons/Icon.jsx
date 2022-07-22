import React from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';
import classNames from 'classnames';
import './icon.css';
import ColourProvider from '../../utils/colourProvider/ColourProvider.js';

export default function Icon(props) {
    const { colourProvider, icon, alt, style, onClick, className } = props;

    return (
        <button
            onClick={onClick}
            type="submit"
            className={classNames(className, 'icon', {
                'bright-icon': !colourProvider.isDark(),
            })}
        >
            <img
                src={`${process.env.PUBLIC_URL}/icons/${icon}.png`}
                style={style}
                alt={alt}
            />
        </button>
    );
}

Icon.propTypes = {
    colourProvider: PropTypes.instanceOf(ColourProvider).isRequired,
    icon: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
    style: stylePropType,
};

Icon.defaultProps = {
    onClick: undefined,
    style: {},
    className: '',
};
