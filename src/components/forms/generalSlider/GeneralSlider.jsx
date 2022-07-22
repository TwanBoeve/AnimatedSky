import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InputNumber, Slider } from 'antd';
import './generalSlider.css';
import ColourProvider from '../../../utils/colourProvider/ColourProvider.js';

export default function GeneralSlider(props) {
    const {
        label,
        initialValue,
        minValue,
        maxValue,
        onChange,
        colourProvider,
    } = props;

    const [value, setSliderValue] = useState(initialValue);
    const color = colourProvider.getColor();
    const sidebarColor = colourProvider.getSidebarColour();

    return (
        <div className="general-slider">
            <div className="label">{label}</div>
            <div className="controller">
                <Slider
                    className="slider"
                    min={minValue}
                    max={maxValue}
                    value={value}
                    onChange={(newValue) => {
                        setSliderValue(newValue);
                        onChange(newValue);
                    }}
                />
                <InputNumber
                    className="inputer"
                    style={{
                        color,
                        backgroundColor: sidebarColor,
                    }}
                    min={minValue}
                    max={maxValue}
                    value={value}
                    onChange={(newValue) => {
                        setSliderValue(newValue);
                        onChange(newValue);
                    }}
                />
            </div>
        </div>
    );
}

GeneralSlider.propTypes = {
    label: PropTypes.string,
    initialValue: PropTypes.number,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    onChange: PropTypes.func,
    colourProvider: PropTypes.instanceOf(ColourProvider).isRequired,
};

GeneralSlider.defaultProps = {
    label: '',
    initialValue: 50,
    minValue: 0,
    maxValue: 100,
    onChange: undefined,
};
