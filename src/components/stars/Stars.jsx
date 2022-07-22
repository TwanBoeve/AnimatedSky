import React from 'react';
import PropTypes from 'prop-types';
import ReactDOMServer from 'react-dom/server.js';
import Graph from 'react-graph-vis';
import _ from 'lodash';
import './stars.css';
import LoadingStars from './LoadingStars';
import DataProvider from '../../utils/dataProvider/DataProvider.js';
import ColourProvider from '../../utils/colourProvider/ColourProvider.js';
import ZoomedOutNode from './ZoomedOutNode';
import ToolTip from './ToolTip';
import i18n from '../../i18n.js';
import './tooltip.css';

const zoomThreshold = 0.4;
const zoomedOutStarSize = 20;
const zoomedInExcludedStarSize = 5;
const zoomedInIncludedStarSize = 10;
const zoomOutLimit = 0.1;
const zoomedOutRadius = 7500;
const zoomedInRadius = 2000;
const starSignificance = 18; // To get 1/4th of all stars this value should be 18
const initialPosition = {
    x: 7695,
    y: 5017,
    scale: 0.51,
};

export default class Stars extends React.Component {
    static toImage(nodeJSX, cultureCount, size) {
        const width = Math.max(size * cultureCount * 1.5 + size * 2, 1000);
        const height = size * 6.5;
        const nodeHTML = ReactDOMServer.renderToStaticMarkup(nodeJSX);
        const nodeSVG = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${width}px" height="${height}px">
            <foreignObject x="0" y="0" width="100%" height="100%">
              <div xmlns="http://www.w3.org/1999/xhtml" style="height: 100%; width: 100%;">
                ${nodeHTML}
              </div>
            </foreignObject>
          </svg>`;
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
            nodeSVG
        )}`;
    }

    static getLines(nodeDOMPositions, edges) {
        /*
        Lines is an object that contains as key the start of the line
        and as value an object that contains as key the end of the line
        and as value an array of line colours that should be drawn
        To ensure no lines are drawn on top of each other it may not occur
        that the line is partially divided over the object. i.e. the start and
        destination is both key on the first level of the object as on the second level
         */
        const unmergedLines = {};
        edges.forEach(({ from, to, color }) => {
            // Convert the id's to the coordinates where to draw the line from
            const fromCoordinates = nodeDOMPositions[from];
            const toCoordinates = nodeDOMPositions[to];

            // Guarantee that both the key and array exist before pushing the colour
            if (!unmergedLines[from]) {
                unmergedLines[from] = { coordinates: fromCoordinates };
            }
            if (!unmergedLines[from][to]) {
                unmergedLines[from][to] = {
                    coordinates: toCoordinates,
                    colours: [],
                };
            }

            // Push the colour
            unmergedLines[from][to].colours.push(color);
        });

        // Merge the lines
        const lines = {};
        Object.entries(unmergedLines).forEach(([from, destinations]) => {
            const { coordinates: fromCoordinates } = destinations;
            Object.entries(destinations).forEach(
                ([to, { coordinates: toCoordinates }]) => {
                    /*
                     coordinates is also one of the keys
                     if the destination is already seen as origin continue
                     */
                    if (to === 'coordinates') {
                        return;
                    }

                    const fromColours = unmergedLines[from]?.[to]?.colours || [];
                    const toColours = unmergedLines[to]?.[from]?.colours || [];

                    const colours = Array.from(
                        new Set(fromColours.concat(toColours))
                    );

                    if (lines[to]) {
                        lines[to][from] = {
                            coordinates: fromCoordinates,
                            colours,
                        };
                    } else {
                        // Guarantee that both the key and array exist before pushing the colour
                        if (!lines[from]) {
                            lines[from] = { coordinates: fromCoordinates };
                        }

                        lines[from][to] = {
                            coordinates: toCoordinates,
                            colours,
                        };
                    }
                }
            );
        });
        return lines;
    }

    constructor(props) {
        super(props);
        const { colourProvider } = props;
        this.colourProvider = colourProvider;

        this.state = {
            isLoading: true,
            nodes: undefined,
            edges: undefined,
        };

        this.providers = {
            zoomedInProvider: new DataProvider(
                zoomedInRadius,
                zoomThreshold,
                starSignificance
            ),
            zoomedOutProvider: new DataProvider(
                zoomedOutRadius,
                zoomThreshold,
                starSignificance
            ),
        };

        this.position = initialPosition;

        this.network = undefined;

        // Set the preference for the edge drawing
        this.gapWidth = parseInt(localStorage.getItem('gapWidth'), 10) || 10;
        this.edgeWidth = parseInt(localStorage.getItem('edgeWidth'), 10) || 10;
        this.edgeOffset = parseInt(localStorage.getItem('edgeOffset'), 10) || 30;

        localStorage.setItem('gapWidth', this.gapWidth);
        localStorage.setItem('edgeWidth', this.edgeWidth);
        localStorage.setItem('edgeOffset', this.edgeOffset);

        // Set the cultures
        this.updateCultures();
    }

    componentDidMount() {
        // Add event listener to collapse button to resize canvas
        const collapseButton = document.getElementById('sidebar-collapser');

        window.addEventListener('resize', () => {
            this.immediateResize();
        });
        collapseButton.addEventListener('click', () => {
            this.animatedResize();
        });

        // Fetch the nodes and edges
        const dataProvider = this.getDataProvider();
        const { x, y } = this.position;
        const nodePromise = dataProvider.giveStars(x, y, initialPosition.scale);
        const edgePromise = dataProvider.giveEdges(
            x,
            y,
            initialPosition.scale,
            this.cultures
        );
        Promise.all([nodePromise, edgePromise]).then(([nodes, edges]) => {
            this.setState({ isLoading: false, nodes, edges });
        });
    }

    componentDidUpdate() {
        // Only prop that can update is the cultures, nonetheless check for difference
        const oldCultures = this.cultures;
        this.updateCultures();
        const newCultures = this.cultures;
        if (!_.isEqual(oldCultures, newCultures)) {
            this.forceDataUpdate();
        }
    }

    componentWillUnmount() {
        // Remove event listeners
        const collapseButton = document.getElementById('sidebar-collapser');

        window.removeEventListener('resize', () => {
            this.immediateResize();
        });
        collapseButton.removeEventListener('click', () => {
            this.animatedResize();
        });
    }

    getDataProvider() {
        const { zoomedInProvider, zoomedOutProvider } = this.providers;

        // Based on whether the view is zoomed in return the provider
        if (this.isZoomedIn()) {
            return zoomedInProvider;
        }
        return zoomedOutProvider;
    }

    determineOffset(startX, toX, startY, toY) {
        const { edgeOffset } = this;
        const goingUp = toY - startY > 0;
        const goingRight = toX - startX > 0;

        // Find the slope of the line crossing both points
        const a = toY - startY;
        const b = startX - toX;
        const slope = -(a / b);

        // Angle in degrees
        const slopeAngle = Math.atan(slope);
        let xOffset = (zoomedInIncludedStarSize / 2 + edgeOffset) * Math.cos(slopeAngle);
        let yOffset = (zoomedInIncludedStarSize / 2 + edgeOffset) * Math.sin(slopeAngle);

        if ((!goingRight && !goingUp) || (!goingRight && goingUp)) {
            xOffset *= -1;
            yOffset *= -1;
        }
        return [xOffset, yOffset];
    }

    drawEdges(nodes, edges, ctx) {
        const nodePositions = {};
        const { edgeWidth, gapWidth } = this;

        nodes.forEach(({ x, y, id }) => {
            nodePositions[id] = { x, y };
        });

        const lines = Stars.getLines(nodePositions, edges);
        ctx.lineWidth = edgeWidth;

        // Cognitive complexity disabled as I could not decreas it
        // eslint-disable-next-line sonarjs/cognitive-complexity
        Object.values(lines).forEach((origins) => {
            const { coordinates: start } = origins;
            const { x: startX, y: startY } = start;

            Object.entries(origins).forEach(([key, destinations]) => {
                if (key === 'coordinates') {
                    return;
                }

                const { coordinates: to, colours } = destinations;
                const { x: toX, y: toY } = to;

                const goingUp = toY - startY > 0;
                const goingRight = toX - startX > 0;

                const [xOffset, yOffset] = this.determineOffset(
                    startX,
                    toX,
                    startY,
                    toY
                );

                const colourCount = colours.length;
                const isEven = colourCount % 2 === 0;
                let shift;
                if (isEven) {
                    shift = -(colourCount / 2) + 1 / 2;
                } else {
                    shift = -Math.floor(colourCount / 2);
                }

                colours.forEach((colour, i) => {
                    let coordShift = (shift + i) * (edgeWidth + gapWidth);
                    if ((!goingRight && !goingUp) || (!goingRight && goingUp)) {
                        coordShift *= -1;
                    }
                    ctx.beginPath();
                    ctx.strokeStyle = colour;
                    if ((!goingRight && goingUp) || (goingRight && !goingUp)) {
                        ctx.moveTo(
                            startX + xOffset + coordShift,
                            startY + yOffset + coordShift
                        );
                        ctx.lineTo(
                            toX - xOffset + coordShift,
                            toY - yOffset + coordShift
                        );
                    } else {
                        ctx.moveTo(
                            startX + xOffset + coordShift,
                            startY + yOffset - coordShift
                        );
                        ctx.lineTo(
                            toX - xOffset + coordShift,
                            toY - yOffset - coordShift
                        );
                    }
                    ctx.stroke();
                });
            });
        });
    }

    styleToZoomedInStars(nodes) {
        const notIncludedHidden = localStorage.getItem('notIncludedHidden') === 'true';
        const notIncludedSmaller = localStorage.getItem('notIncludedSmaller') === 'true';
        const notIncludedTransparent = localStorage.getItem('notIncludedTransparent') === 'true';

        const { colourProvider } = this;
        const starColour = colourProvider.getStarColour();

        return nodes.map(({ x, y, id, label, magnitude, isIncluded }) => {
            let size = zoomedInIncludedStarSize;
            let fontSize = size * 2;

            let opacity = magnitude / 100;

            if (!isIncluded) {
                // Not Included hidden
                if (notIncludedHidden) {
                    return {};
                }

                // Not Included smaller
                if (notIncludedSmaller) {
                    size = zoomedInExcludedStarSize;
                    fontSize = size;
                }

                // Not Included made transparent
                if (notIncludedTransparent) {
                    opacity = 0.05;
                }
            }

            return {
                x,
                y,
                id,
                label,
                opacity,
                size,
                font: {
                    size: fontSize,
                },
                shadow: {
                    enabled: true,
                    color: starColour,
                    x: 0,
                    y: 0,
                    shape: 'circle',
                    size: size * 1.5,
                },
                isIncluded,
            };
        });
    }

    updateCultures() {
        // Get the selected Cultures
        const { cultures: cultureObjects } = this.props;
        this.cultures = [];
        this.allCultures = [];
        cultureObjects.forEach(({ culture, enabled }) => {
            if (enabled) {
                this.cultures.push(culture);
            }
            this.allCultures.push({ culture, enabled });
        });
    }

    isZoomedIn() {
        // This function is used by getDataProvider so do not call that function
        return this.position.scale > zoomThreshold;
    }

    // Zoomen feut
    changeZoom(newScale) {
        const dataProvider = this.getDataProvider();
        const { scale: oldScale } = this.position;
        const wasZoomedIn = dataProvider.isZoomedIn(oldScale);
        const isZoomedIn = dataProvider.isZoomedIn(newScale);

        // Change the scale of the class
        this.position.scale = newScale;

        // If the zoom level has changed update the position
        if (isZoomedIn !== wasZoomedIn) {
            this.updatePosition({ newScale });
        }
    }

    checkZoomLimit(scale) {
        // If the scale exceeds the zoomOut or zoomIn limit move the user back
        if (scale < zoomOutLimit) {
            this.network.moveTo({ scale: zoomOutLimit });
            return false;
        }

        return true;
    }

    updateCoordinates(x, y) {
        this.updatePosition({
            newX: x,
            newY: y,
        });
    }

    updatePosition({ newX, newY, newScale }) {
        // Fetch the current position
        const {
            cultures,
            position: { x: oldX, y: oldY, scale: oldScale },
        } = this;

        const x = newX || oldX;
        const y = newY || oldY;
        const scale = newScale || oldScale;

        // Get the old nodes
        const { nodes, edges } = this.state;

        // Update the position and nodes and edges
        this.position = { x, y, scale };
        const dataProvider = this.getDataProvider();

        const nodePromise = dataProvider.giveStars(x, y, scale);
        const edgePromise = dataProvider.giveEdges(x, y, scale, cultures);
        Promise.all([nodePromise, edgePromise]).then(([newNodes, newEdges]) => {
            if (!(_.isEqual(nodes, newNodes) && _.isEqual(edges, newEdges))) {
                this.setState({ nodes: newNodes, edges: newEdges });
            }
        });
    }

    forceDataUpdate() {
        this.updatePosition({});
    }

    animatedResize() {
        // Resizing zooms the user either in or out so check for scale after animation
        for (let i = 0; i < 33; i += 1) {
            _.delay(() => {
                this.network.redraw();
            }, i * 3);
        }
        _.delay(() => {
            this.changeZoom(this.network.getScale());
        }, 100);
    }

    immediateResize() {
        this.network.redraw();
        this.changeZoom(this.network.getScale());
    }

    styleToZoomedOutStars(nodes) {
        const { cultures, colourProvider } = this;

        // Get the styling
        const starColour = colourProvider.getStarColour();
        const color = colourProvider.getColor();
        const palette = colourProvider.getEdgePalette();

        return nodes.map(
            ({ id, x, y, label, magnitude, cultures: nodeCultures }) => {
                // Put here otherwise prettier is angry
                // eslint-disable-next-line arrow-body-style
                const culturesToDisplay = nodeCultures.filter((culture) => {
                    return cultures.includes(culture);
                });

                return {
                    x,
                    y,
                    image: Stars.toImage(
                        <ZoomedOutNode
                            id={id}
                            label={label || i18n.t('UnnamedStar')}
                            starColour={starColour}
                            cultures={culturesToDisplay}
                            palette={palette}
                            size={zoomedOutStarSize}
                            color={color}
                            opacity={magnitude / 100}
                        />,
                        culturesToDisplay.length,
                        zoomedOutStarSize
                    ),
                    shape: 'image',
                    shapeProperties: {
                        borderRadius: 0,
                        useImageSize: true,
                    },
                };
            }
        );
    }

    styleEdges(edges) {
        const { colourProvider } = this;
        const showColours = colourProvider.showEdgeColours();
        const palette = colourProvider.getEdgePalette();

        /*
         When colours are not shown make sure only to draw one edge between
         the stars, so filter the duplicates away
         In the drawnEdges, each object is added with each other node it
         is connected to
         */
        const drawnEdges = {};
        const colouredEdges = [];

        edges.forEach((edge) => {
            const { culture, from, to } = edge;

            if (!showColours) {
                if (!drawnEdges[from]) {
                    drawnEdges[from] = new Set();
                }
                if (!drawnEdges[to]) {
                    drawnEdges[to] = new Set();
                }
                const hasTo = drawnEdges[from].has(to);
                const hasFrom = drawnEdges[to].has(from);
                const contained = hasTo || hasFrom;

                drawnEdges[from].add(to);
                drawnEdges[from].add(from);

                if (contained) {
                    return;
                }
            }

            const color = showColours ? palette[culture] : this.colourProvider.getColor();
            colouredEdges.push({
                ...edge,
                src: null,
                color,
            });
        });

        return colouredEdges;
    }

    zoomToStar(x, y) {
        const newLevel = zoomThreshold + 0.2;
        this.network.moveTo({
            position: { x, y },
            scale: newLevel,
            animation: {
                duration: 300,
                easingFunction: 'easeInQuad',
            },
        });
        this.changeZoom(newLevel);
    }

    giveToolTips(nodes) {
        return nodes.map((node) => {
            if (!node.isIncluded) {
                return node;
            }
            const { id: rawId, label } = node;
            const id = rawId.split('-').pop();
            const constellations = DataProvider.getConstellations(
                id,
                this.cultures
            );
            const title = document.createElement('div');
            const toolTip = ReactDOMServer.renderToStaticMarkup(<ToolTip
                colourProvider={this.colourProvider}
                starTitle={label}
                constellations={constellations}
            />);
            title.innerHTML = `<div>${toolTip}</div>`;
            return {
                ...node,
                title,
            };
        });
    }

    render() {
        const { isLoading } = this.state;
        const { colourProvider, edgeOffset, edgeWidth } = this;
        const backgroundColor = colourProvider.getBackgroundColour();

        if (isLoading) {
            return <LoadingStars colourProvider={colourProvider} />;
        }

        let options = {
            interaction: {
                dragNodes: false,
            },
            physics: {
                enabled: false,
            },
        };

        // Get the stars and edges, and style them accordingly
        let { nodes, edges } = this.state;
        const isZoomedIn = this.isZoomedIn();

        if (isZoomedIn) {
            const starColour = colourProvider.getStarColour();
            const color = colourProvider.getColor();

            const edgeBlocker = `
                <svg xmlns="http://www.w3.org/2000/svg" width="${edgeOffset}px" height="0px">
                    <rect width="${edgeOffset}" height="0" fill="${backgroundColor}"/>
                </svg>`;

            const edgeBlockerSrc = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                edgeBlocker
            )}`;

            edges = this.styleEdges(edges);
            nodes = DataProvider.filterNodes(nodes, edges);
            nodes = this.styleToZoomedInStars(nodes);
            nodes = this.giveToolTips(nodes);

            options = {
                ...options,
                nodes: {
                    borderWidth: 0,
                    color: {
                        background: starColour,
                        border: starColour,
                    },
                    font: {
                        color,
                        face: 'lato',
                        vadjust: -5,
                    },
                    shape: 'dot',
                },
                edges: {
                    width: edgeWidth,
                    arrows: {
                        to: {
                            enabled: true,
                            src: edgeBlockerSrc,
                            type: 'image',
                            imageHeight: edgeOffset,
                            imageWidth: edgeOffset,
                        },
                        from: {
                            enabled: true,
                            src: edgeBlockerSrc,
                            type: 'image',
                            imageHeight: edgeOffset,
                            imageWidth: edgeOffset,
                        },
                    },
                    endPointOffset: {
                        from: edgeOffset,
                        to: edgeOffset,
                    },
                    arrowStrikethrough: false,
                },
            };
        } else {
            nodes = this.styleToZoomedOutStars(nodes);
        }

        // Edges are drawn via a custom function
        const graph = {
            nodes,
            edges: [],
        };

        /*
        zoom to alter between zoomed in and zoomed out view
        dragEnd to update X and Y position accordingly
         */
        let events = {
            zoom: _.debounce(({ scale }) => {
                if (this.checkZoomLimit(scale)) {
                    this.changeZoom(scale);
                }
            }, 300),
            dragEnd: _.debounce(() => {
                const { x, y } = this.network.getViewPosition();
                this.updateCoordinates(x, y);
            }, 300),
            afterDrawing: (ctx) => {
                this.drawEdges(nodes, edges, ctx);
            },
        };

        if (!isZoomedIn) {
            events = {
                ...events,
                selectNode: ({
                    pointer: {
                        canvas: { x, y },
                    },
                }) => {
                    this.zoomToStar(x, y);
                },
            };
        }

        return (
            <div className="stars" style={{ backgroundColor }}>
                <Graph
                    graph={graph}
                    options={options}
                    events={events}
                    getNetwork={(network) => {
                        this.network = network;
                        this.network.moveTo({
                            position: {
                                x: initialPosition.x,
                                y: initialPosition.y,
                            },
                            scale: initialPosition.scale,
                        });
                    }}
                />
            </div>
        );
    }
}

Stars.propTypes = {
    colourProvider: PropTypes.instanceOf(ColourProvider).isRequired,
    cultures: PropTypes.arrayOf(
        PropTypes.shape({
            culture: PropTypes.string,
            enabled: PropTypes.bool,
        })
    ).isRequired,
};
