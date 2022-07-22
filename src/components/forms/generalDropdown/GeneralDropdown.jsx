import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './generalDropdown.css';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ColourProvider from '../../../utils/colourProvider/ColourProvider.js';

export default function GeneralDropdown(props) {
    const { label, options, colourProvider, onSelect, selectedValue } = props;
    const sidebarColour = colourProvider.getSidebarColour();
    const color = colourProvider.getColor();

    const { t } = useTranslation();

    // eslint-disable-next-line react/prop-types
    const Toggler = React.forwardRef(({ children, onClick }, ref) => (
        <button
            style={{
                backgroundColor: sidebarColour,
                color,
                border: `1px solid ${color}`,
            }}
            type="submit"
            className="dropdown-toggle"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}
        </button>
    ));

    return (
        <div className="general-dropdown">
            {t(label)}
            <Dropdown onSelect={onSelect}>
                <Dropdown.Toggle as={Toggler}>
                    {t(selectedValue || label)}
                </Dropdown.Toggle>
                <Dropdown.Menu
                    style={{
                        backgroundColor: sidebarColour,
                        border: `1px solid ${color}`,
                    }}
                >
                    {options.map(({ label: optionLabel, id }) => (
                        <DropdownItem
                            key={`generaldropdown-${optionLabel}-item`}
                            optionLabel={optionLabel}
                            id={id}
                            colourProvider={colourProvider}
                        />
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

function DropdownItem(props) {
    const { optionLabel, id, colourProvider } = props;
    const [isHover, setHover] = useState(false);
    const sidebarColour = colourProvider.getSidebarColour();
    const color = colourProvider.getColor();
    const textColour = isHover ? sidebarColour : color;

    const { t } = useTranslation();

    return (
        <div
            key={`general-dropdown-${optionLabel}-wrapper`}
            onMouseEnter={() => {
                setHover(true);
            }}
            onMouseLeave={() => {
                setHover(false);
            }}
        >
            <Dropdown.Item id={id} style={{ color: textColour }} eventKey={id}>
                {t(optionLabel)}
            </Dropdown.Item>
        </div>
    );
}

DropdownItem.propTypes = {
    optionLabel: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    colourProvider: PropTypes.instanceOf(ColourProvider).isRequired,
};

GeneralDropdown.propTypes = {
    label: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            label: PropTypes.string,
        })
    ),
    colourProvider: PropTypes.instanceOf(ColourProvider).isRequired,
    selectedValue: PropTypes.string,
    onSelect: PropTypes.func,
};

GeneralDropdown.defaultProps = {
    label: '',
    options: [],
    selectedValue: undefined,
    onSelect: undefined,
};
