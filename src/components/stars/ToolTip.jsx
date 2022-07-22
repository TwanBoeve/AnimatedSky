import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './tooltip.css';
import ColourProvider from '../../utils/colourProvider/ColourProvider.js';
import DataProvider from '../../utils/dataProvider/DataProvider.js';

export default function ToolTip(props) {
    const { starTitle, constellations, colourProvider } = props;

    const sidebarColour = colourProvider.getSidebarColour();
    const color = colourProvider.getColor();

    const { t } = useTranslation();

    return (
        <div
            style={{
                width: '250px',
                backgroundColor: sidebarColour,
                border: `1px solid ${color}`,
                borderRadius: '10px',
                marginTop: '50px',
                paddingTop: '5px',
                paddingBottom: '5px',
                color,
            }}
        >
            <span
                style={{
                    fontSize: '17px',
                    marginLeft: '10px',
                    marginBottom: '5px',
                }}
            >
                {starTitle}
            </span>
            <div style={{ height: '250px', overflowY: 'scroll' }}>
                {constellations.map(
                    ({ culture, label, constellationEdges: rawEdges }) => {
                        const uniqueEdges = new Set();
                        rawEdges.forEach(({ from, to }) => {
                            uniqueEdges.add(from);
                            uniqueEdges.add(to);
                        });

                        const stars = Array.from(uniqueEdges);

                        const showColours = colourProvider.showEdgeColours();
                        const cultureColour = showColours
                            ? colourProvider.getEdgeColour(culture)
                            : colourProvider.getColor();
                        return (
                            <div style={{ marginBottom: '15px' }}>
                                <div
                                    style={{
                                        width: '100%',
                                        borderBottom: `1px solid ${cultureColour}`,
                                        paddingLeft: '10px',
                                        paddingRight: '10px',
                                        fontSize: '15px',
                                    }}
                                >
                                    {`${label} - ${t(DataProvider.getNamedCulture(culture))}`}
                                </div>
                                <span style={{ paddingLeft: '10px' }}>
                                    {`${t(
                                        'Stars'
                                    )}: ${stars.length}`}
                                </span>
                                <div
                                    style={{
                                        paddingLeft: '15px',
                                        paddingRight: '10px',
                                        fontSize: '13px',
                                    }}
                                >
                                    {stars.map((id) => (
                                        <span style={{ display: 'block' }}>
                                            {DataProvider.getStarName(id)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    }
                )}
            </div>
        </div>
    );
}

ToolTip.propTypes = {
    starTitle: PropTypes.string.isRequired,
    constellations: PropTypes.arrayOf(
        PropTypes.shape({
            culture: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            edges: PropTypes.shape({
                from: PropTypes.string.isRequired,
                to: PropTypes.string.isRequired,
            }),
        })
    ).isRequired,
    colourProvider: PropTypes.oneOf(ColourProvider).isRequired,
};
