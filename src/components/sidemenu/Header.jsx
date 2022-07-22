import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import stylePropType from 'react-style-proptype';
import ColourProvider from '../../utils/colourProvider/ColourProvider.js';
import Icon from '../icons/Icon';
import './header.css';

export default function Header(props) {
    const { colourProvider, title, onSettings, onAdd, onSave, style } = props;

    const { t } = useTranslation();

    const addIcon = onAdd ? (
        <Icon
            colourProvider={colourProvider}
            icon="plus"
            alt={t('Add')}
            onClick={onAdd}
        />
    ) : undefined;
    const cogIcon = onSettings ? (
        <Icon
            colourProvider={colourProvider}
            icon="cog"
            alt={t('Settings')}
            onClick={onSettings}
        />
    ) : undefined;
    const saveIcon = onSave ? (
        <Icon
            colourProvider={colourProvider}
            icon="save"
            alt={t('Save')}
            onClick={onSave}
        />
    ) : undefined;

    return (
        <div
            className="menu-header"
            style={{
                borderTop: `1px solid ${colourProvider.getBorderColour()}`,
                borderBottom: `1px solid ${colourProvider.getBorderColour()}`,
                ...style,
            }}
        >
            {title}
            <div className="icon-wrapper">
                {saveIcon}
                {addIcon}
                {cogIcon}
            </div>
        </div>
    );
}

Header.propTypes = {
    colourProvider: PropTypes.instanceOf(ColourProvider).isRequired,
    title: PropTypes.string,
    onSettings: PropTypes.func,
    onAdd: PropTypes.func,
    onSave: PropTypes.func,
    style: stylePropType,
};

Header.defaultProps = {
    title: '',
    onSettings: undefined,
    onAdd: undefined,
    onSave: undefined,
    style: {},
};
