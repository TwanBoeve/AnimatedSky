import ErrorFactory from '../errors/ErrorFactory.js';
import { edges } from './data/edges.js';
import { nodes } from './data/nodes.js';

export default class DataProvider {
    /**
     * @param {number} radius, within what radius of the screen-center should data be provided
     * @param {number} zoomThreshold, at what threshold should the system switch between views
     * @param {number} starSignificance, how often stars should be included
     * in constellation to appear in zoomed out view
     */
    constructor(radius, zoomThreshold, starSignificance) {
        this.radius = radius;
        this.zoomThreshold = zoomThreshold;
        this.starSignificance = starSignificance;
        this.edges = edges;

        // Determine which culture each star is placed in
        const stars = {};
        Object.entries(this.edges).forEach(([key, { constellations }]) => {
            constellations.forEach(({ edges: constellation }) => {
                constellation.forEach(({ from, to }) => {
                    if (!(from in stars)) {
                        stars[from] = {
                            ...nodes[from],
                            id: from,
                            cultures: [],
                        };
                    }
                    if (!(to in stars)) {
                        stars[to] = { ...nodes[to], id: to, cultures: [] };
                    }
                    if (!stars[from].cultures.includes(key)) {
                        stars[from].cultures.push(key);
                    }
                    if (!stars[to].cultures.includes(key)) {
                        stars[to].cultures.push(key);
                    }
                });
            });
        });

        // Create an array for all stars (zoomed in) and for significant stars (zoomed out)
        const zoomedOutStars = [];
        const zoomedInStars = [];
        Object.values(stars).forEach((value) => {
            if (value.cultures.length >= this.starSignificance) {
                zoomedOutStars.push(value);
            }
            zoomedInStars.push(value);
        });
        this.zoomedOutStars = zoomedOutStars;
        this.zoomedInStars = zoomedInStars;
    }

    /**
     * Gives the nodes of the graph (stars) relevant to that viewport
     * @param {number} viewX, the x coordinate of the viewport
     * @param {number} viewY, the y coordinate of the viewport
     * @param {number} zoomPosition, how far the user is zoomed in
     * @returns {[{id: String, label: string, x: number, y: number, magnitude: number}]}
     * array of stars with id, name, x and y value and magnitude
     */
    async giveStars(viewX, viewY, zoomPosition) {
        // Error checking
        if (arguments.length > 3) {
            throw ErrorFactory.tooManyArgumentsError(3, arguments.length);
        }
        if (arguments.length < 3) {
            throw ErrorFactory.missingArgumentError(3, arguments.length);
        }
        if (typeof viewX !== 'number') {
            throw ErrorFactory.typeError(
                'number',
                typeof viewX,
                'unadjustedViewX'
            );
        }
        if (typeof viewY !== 'number') {
            throw ErrorFactory.typeError(
                'number',
                typeof viewY,
                'unadjustedViewY'
            );
        }
        if (typeof zoomPosition !== 'number') {
            throw ErrorFactory.typeError(
                'number',
                typeof zoomPosition,
                'zoomPosition'
            );
        }
        if (zoomPosition < 0) {
            throw ErrorFactory.argumentError(
                'Zoom position should be a positive number'
            );
        }

        const { radius } = this;

        /*
        Adjust the viewX and viewY to be 'normal' meaning within 0 and highest x and y
         */
        const highestX = DataProvider.findHighestX();
        const highestY = DataProvider.findHighestY();

        const xShift = Math.floor(viewX / highestX);
        const yShift = Math.floor(viewY / highestY);

        const xRangeMax = viewX + radius;
        const xRangeMin = viewX - radius;

        const yRangeMax = viewY + radius;
        const yRangeMin = viewY - radius;

        const unfilteredStars = this.isZoomedIn(zoomPosition)
            ? this.zoomedInStars
            : this.zoomedOutStars;

        const stars = [];

        unfilteredStars.forEach((star) => {
            const { x: starX, y: starY, id } = star;

            const positiveX = DataProvider.findPanes(
                xRangeMin,
                xRangeMax,
                starX,
                highestX,
                xShift,
                true
            );
            const negativeX = DataProvider.findPanes(
                xRangeMin,
                xRangeMax,
                starX - highestX,
                highestX,
                xShift,
                false
            );

            const xAxis = positiveX.concat(negativeX);

            const positiveY = DataProvider.findPanes(
                yRangeMin,
                yRangeMax,
                starY,
                highestY,
                yShift,
                true
            );
            const negativeY = DataProvider.findPanes(
                yRangeMin,
                yRangeMax,
                starY - highestY,
                highestY,
                yShift,
                false
            );

            const yAxis = positiveY.concat(negativeY);

            xAxis.forEach(({ shift: starXShift, coordinate: x }) => {
                yAxis.forEach(({ shift: starYShift, coordinate: y }) => {
                    stars.push({
                        ...star,
                        realId: id,
                        id: `${starXShift}-${starYShift}-${id}`,
                        x,
                        y,
                    });
                });
            });
        });

        return stars;
    }

    static findPanes(
        rangeMin,
        rangeMax,
        coordinate,
        highestValue,
        shift,
        isPositiveDirection
    ) {
        const result = [];
        // Create a copy to be used in the loop paired with an index
        let coordinateCopy = coordinate;

        // Adjust the coordinate to the shift
        coordinateCopy += highestValue * shift;

        // When going negative skip the first iteration as the positive version does that
        let i = isPositiveDirection ? 0 : -1;

        /*
        It may be that the star is not included in the main pane
        But should be included in the neighbour
        Therefore, it may fail once
         */
        let firstFail = false;
        let inRange = rangeMin <= coordinateCopy && coordinateCopy <= rangeMax;
        while (!firstFail || inRange) {
            /*
            If it is included in this pane push it to the results
            Otherwise indicate that if failed once
             */
            if (inRange) {
                result.push({
                    coordinate: coordinateCopy,
                    shift: shift + i,
                });
            } else {
                firstFail = true;
            }

            // Adjust the coordinate to the new pane
            if (isPositiveDirection) {
                coordinateCopy += highestValue;
                i += 1;
            } else {
                coordinateCopy -= highestValue;
                i -= 1;
            }

            inRange = rangeMin <= coordinateCopy && coordinateCopy <= rangeMax;
        }

        return result;
    }

    /**
     * Gives the nodes of the graph (stars) relevant to that viewport
     * @param {number} x, the x coordinate of the viewport
     * @param {number} y, the y coordinate of the viewport
     * @param {number} zoomPosition, how far the user is zoomed in
     * @param {[String]} selectedCultures, the cultures which should be displayed
     * @returns {[culture: [
     *  {id: String, label: String, edges: [{from: String, to: String, weight: number}]}]
     * ]}
     */
    // Put here as otherwise there are many functions contributing to one thing
    // eslint-disable-next-line sonarjs/cognitive-complexity
    async giveEdges(x, y, zoomPosition, selectedCultures) {
        // Error checking
        if (arguments.length > 4) {
            throw ErrorFactory.tooManyArgumentsError(4, arguments.length);
        }
        if (arguments.length < 4) {
            throw ErrorFactory.missingArgumentError(4, arguments.length);
        }
        if (typeof x !== 'number') {
            throw ErrorFactory.typeError('number', typeof x, 'x');
        }
        if (typeof y !== 'number') {
            throw ErrorFactory.typeError('number', typeof y, 'y');
        }
        if (typeof zoomPosition !== 'number') {
            throw ErrorFactory.typeError(
                'number',
                typeof zoomPosition,
                'zoomPosition'
            );
        }
        if (typeof selectedCultures !== 'object') {
            throw ErrorFactory.typeError(
                'object',
                typeof selectedCultures,
                'selectedCultures'
            );
        }
        if (zoomPosition < 0) {
            throw ErrorFactory.argumentError(
                'Coordinates & zoom position should be a positive number'
            );
        }

        const result = [];

        const isZoomedIn = this.isZoomedIn(zoomPosition);
        if (!isZoomedIn) {
            return result;
        }

        // Get the nodes for this view
        const stars = await this.giveStars(x, y, zoomPosition);

        // Group the stars based on their realId
        const groupedStars = {};
        stars.forEach((star) => {
            const { realId } = star;
            if (!groupedStars[realId]) {
                groupedStars[realId] = [];
            }

            groupedStars[realId].push(star);
        });

        Object.entries(edges).forEach(([culture, { constellations }]) => {
            // Only loop over the selected cultures
            if (!selectedCultures.includes(culture)) {
                return;
            }

            constellations.forEach(({ edges: constellation }) => {
                constellation.forEach(({ from: star1Id, to: star2Id }) => {
                    const [from, to] = DataProvider.provideShortestEdge(
                        groupedStars[star1Id],
                        groupedStars[star2Id]
                    );

                    if (from && to) {
                        result.push({
                            from,
                            to,
                            weight: 1,
                            culture,
                            selfReferencing: from !== to,
                        });
                    }
                });
            });
        });

        return result;
    }

    static provideShortestEdge(array1 = [], array2 = []) {
        let star1;
        let star2;
        let leastDistance = -1;

        array1.forEach(({ x: x1, y: y1, id: id1 }) => {
            array2.forEach(({ x: x2, y: y2, id: id2 }) => {
                // It does not matter in which order to minus as it will be squared
                const xDistance = x2 - x1;
                const yDistance = y2 - y1;
                const distance = Math.sqrt(xDistance ** 2 + yDistance ** 2);
                if (leastDistance === -1 || distance < leastDistance) {
                    leastDistance = distance;
                    star1 = id1;
                    star2 = id2;
                }
            });
        });

        return [star1, star2];
    }

    /**
     * Determines whether the user should get the zoomed in view
     * @param {number} zoomPosition, how far the user is zoomed in
     * @returns {boolean | undefined} true if zoomed in, false if zoomed out
     */
    isZoomedIn(zoomPosition) {
        if (zoomPosition < 0) {
            throw ErrorFactory.argumentError(
                'Zoom position should be a positive number'
            );
        }
        if (!zoomPosition) {
            throw ErrorFactory.missingArgumentError(1, 0);
        }
        if (typeof zoomPosition !== 'number') {
            throw ErrorFactory.typeError(
                'number',
                typeof zoomPosition,
                'zoomPosition'
            );
        }

        return zoomPosition > this.zoomThreshold;
    }

    static filterNodes(stars, lines) {
        const includedStars = new Set();

        lines.forEach(({ from, to }) => {
            includedStars.add(from);
            includedStars.add(to);
        });

        return stars.map((star) => ({
            ...star,
            isIncluded: includedStars.has(star.id),
        }));
    }

    static findHighestX() {
        if (arguments.length > 0) {
            throw ErrorFactory.tooManyArgumentsError(0, arguments.length);
        }
        return Math.max(...Object.values(nodes).map(({ x }) => x));
    }

    static findHighestY() {
        if (arguments.length > 0) {
            throw ErrorFactory.tooManyArgumentsError(0, arguments.length);
        }

        return Math.max(...Object.values(nodes).map(({ y }) => y));
    }

    static findLowestX() {
        if (arguments.length > 0) {
            throw ErrorFactory.tooManyArgumentsError(0, arguments.length);
        }

        return Math.min(...Object.values(nodes).map(({ x }) => x));
    }

    static findLowestY() {
        if (arguments.length > 0) {
            throw ErrorFactory.tooManyArgumentsError(0, arguments.length);
        }

        return Math.min(...Object.values(nodes).map(({ y }) => y));
    }

    static findMiddleX() {
        if (arguments.length > 0) {
            throw ErrorFactory.tooManyArgumentsError(0, arguments.length);
        }

        const maxX = DataProvider.findHighestX();
        const minX = DataProvider.findLowestX();
        return Math.round((maxX + minX) / 2);
    }

    static findMiddleY() {
        if (arguments.length > 0) {
            throw ErrorFactory.tooManyArgumentsError(0, arguments.length);
        }

        const maxY = DataProvider.findHighestY();
        const minY = DataProvider.findLowestY();
        return Math.round((maxY + minY) / 2);
    }

    /**
     * Returns the name of the given culture
     * @param culture name used as key in data
     */
    static getNamedCulture(culture) {
        try {
            return edges[culture].name;
        } catch (TypeError) {
            throw ErrorFactory.argumentError(
                'Culture is missing from data-set'
            );
        }
    }

    /**
     * Returns the proper name of all cultures
     * @returns {[String]} list of proper culture names
     */
    static listNamedCultures() {
        return Object.values(edges).map(({ name }) => name);
    }

    /**
     * Returns a list with the possible cultures
     * @returns {[String]} a list with the named cultures
     */
    static listCultures() {
        if (arguments.length > 0) {
            throw ErrorFactory.tooManyArgumentsError(0, arguments.length);
        }

        return Object.keys(edges);
    }

    static getConstellations(nodeId, selectedCultures) {
        const selectedCulturesSet = new Set(selectedCultures);

        const includedConstellations = [];
        Object.entries(edges).forEach(([culture, { constellations }]) => {
            if (!selectedCulturesSet.has(culture)) {
                return;
            }
            constellations.forEach(({ id, label, edges: constellationEdges }) => {
                let isIncluded = false;
                constellationEdges.forEach(({ from, to }) => {
                    if (isIncluded) {
                        return;
                    }
                    isIncluded = isIncluded || from === nodeId || to === nodeId;
                });
                if (isIncluded) {
                    includedConstellations.push({ culture, id, label, constellationEdges });
                }
            });
        });
        return includedConstellations;
    }

    static getStarName(id) {
        return nodes[id].label;
    }
}
