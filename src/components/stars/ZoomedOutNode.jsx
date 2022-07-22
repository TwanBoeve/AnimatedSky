import React from 'react';
import PropTypes from 'prop-types';

export default function ZoomedOutNode({
    id,
    label,
    cultures,
    palette,
    starColour,
    size,
    color,
    opacity,
}) {
    const displayColourBoxes = Object.values(palette).length <= 12;

    // All styling is done within div as otherwise it is not converted correctly
    return (
        <div
            key={`node-${id}`}
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                color,
                fontSize: `${size * 2}px`,
                fontFamily: 'lato',
            }}
        >
            <div
                style={{
                    marginLeft: `${size / 2}px`,
                    backgroundColor: starColour,
                    boxShadow: `0 0 ${size / 2}px ${starColour}`,
                    borderRadius: '100%',
                    width: `${size}px`,
                    height: `${size}px`,
                    opacity,
                }}
            />
            <div
                style={{
                    marginTop: `${size * 2}px`,
                    marginLeft: `${size}px`,
                }}
            >
                {label}
                <div
                    style={{
                        display: 'flex',
                    }}
                >
                    {cultures.map((cultureId) => {
                        if (!displayColourBoxes) {
                            return null;
                        }

                        return (
                            <div
                                key={`node-${id}-culture-${cultureId}`}
                                style={{
                                    backgroundColor: palette[cultureId],
                                    width: `${size * 1.5}px`,
                                    height: `${size * 1.5}px`,
                                    border: '1px solid #0d0d0d',
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

ZoomedOutNode.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    cultures: PropTypes.arrayOf(PropTypes.string).isRequired,
    palette: PropTypes.objectOf(PropTypes.string).isRequired,
    starColour: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    opacity: PropTypes.number.isRequired,
};
