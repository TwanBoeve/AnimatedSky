import React from 'react';
import ContentLoader from 'react-content-loader';
import PropTypes from 'prop-types';
import ColourProvider from '../../utils/colourProvider/ColourProvider.js';

export default class LoadingStars extends React.Component {
    // The loading stars to display
    static stars = [
        {
            x: 0.11,
            y: 0.88,
        },
        {
            x: 0.22,
            y: 0.22,
        },
        {
            x: 0.31,
            y: 0.56,
        },
        {
            x: 0.37,
            y: 0.31,
        },
        {
            x: 0.61,
            y: 0.42,
        },
        {
            x: 0.63,
            y: 0.78,
        },
        {
            x: 0.86,
            y: 0.21,
        },
    ];

    constructor(props) {
        super(props);

        this.ref = React.createRef();
        this.state = {
            width: undefined,
            height: undefined,
        };
    }

    componentDidMount() {
        const { offsetWidth: width, offsetHeight: height } = this.ref.current;
        this.setState({ width, height });
    }

    render() {
        const { colourProvider } = this.props;
        const { width, height } = this.state;

        const color = colourProvider.getColor();
        const backgroundColor = colourProvider.getBackgroundColour();

        if (!width && !height) {
            return <div ref={this.ref} className="loadingStars" />;
        }

        return (
            <div ref={this.ref} className="loadingStars">
                <ContentLoader
                    width={width}
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    foregroundColor={color}
                    backgroundColor={backgroundColor}
                    style={{ backgroundColor }}
                    speed={2}
                    interval={0}
                >
                    {LoadingStars.stars.map(({ x, y }) => (
                        <circle
                            cx={x * width}
                            cy={y * height}
                            r={10}
                            key={`loadstar-${x}-${y}`}
                        />
                    ))}
                </ContentLoader>
            </div>
        );
    }
}

LoadingStars.propTypes = {
    colourProvider: PropTypes.instanceOf(ColourProvider).isRequired,
};
