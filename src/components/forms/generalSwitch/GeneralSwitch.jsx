import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Switch } from 'antd';
import './generalSwitch.css';

export default function GeneralSwitch(props) {
    const { label, isChecked, onChange } = props;

    const { t } = useTranslation();

    let style = {};
    if (!isChecked) {
        style = {
            backgroundColor: '#555',
        };
    }

    return (
        <div className="general-switch">
            {t(label)}
            <div className="switch-wrapper">
                <Switch
                    defaultChecked={isChecked}
                    onChange={onChange}
                    style={style}
                />
            </div>
        </div>
    );
}

GeneralSwitch.propTypes = {
    label: PropTypes.string,
    isChecked: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
};

GeneralSwitch.defaultProps = {
    label: '',
    onChange: undefined,
};
