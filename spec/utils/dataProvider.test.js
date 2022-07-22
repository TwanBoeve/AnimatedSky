import DataProvider from '../../src/utils/dataProvider/DataProvider.js';
import ErrorFactory from '../../src/utils/errors/ErrorFactory.js';
import { edges } from '../../src/utils/dataProvider/data/edges.js';

describe('Zoom Tests', () => {
    const provider = new DataProvider(100, 1000, 18);

    it('When zoomed out isZoomedIn should be false', () => {
        expect(provider.isZoomedIn(1001)).toBeTrue();
    });

    it('When zoomed in isZoomedIn should be true', () => {
        expect(provider.isZoomedIn(10)).toBeFalse();
    });

    it('isZoomedIn only accepts positive integers', () => {
        expect(() => {
            provider.isZoomedIn(-1);
        }).toThrow(
            ErrorFactory.argumentError(
                'Zoom position should be a positive number'
            )
        );
        expect(() => {
            provider.isZoomedIn();
        }).toThrow(ErrorFactory.missingArgumentError(1, 0));
        expect(() => {
            provider.isZoomedIn('string');
        }).toThrow(ErrorFactory.typeError('number', 'string', 'zoomPosition'));
    });
});

describe('Culture listing tests', () => {
    // Warning: Hard coded to 41 cultures as edges.js has 41 cultures
    it('Expect 41 cultures when listing cultures', () => {
        expect(DataProvider.listCultures()).toHaveSize(41);
    });

    it('List cultures of dataProvider does not accept arguments', () => {
        expect(() => {
            DataProvider.listCultures('Argument');
        }).toThrow(ErrorFactory.tooManyArgumentsError(0, 1));
    });
});

describe('Node provider tests', () => {
    const starSignificance = 18;
    const provider = new DataProvider(3000, 1000, starSignificance);

    const frequency = {};
    Object.values(edges).forEach(({ constellations }) => {
        constellations.forEach(({ edges: constellation }) => {
            constellation.forEach(({ from, to }) => {
                if (!(from in frequency)) {
                    frequency[from] = 0;
                }
                if (!(to in frequency)) {
                    frequency[to] = 0;
                }
                frequency[from] += 1;
                frequency[to] += 1;
            });
        });
    });

    const zoomedInStars = provider.giveStars(0, 0, 1001);
    const zoomedOutStars = provider.giveStars(0, 0, 999);

    it('zoomedIn and zoomedOut difference', () => {
        expect(zoomedInStars >= zoomedOutStars).toBeTrue();
    });

    it('Determine whether significant stars remain in zoomed out and insignificant get filtered out', () => {
        const insignificants = [];
        const significants = [];

        Object.entries(frequency).forEach(([key, value]) => {
            if (value >= starSignificance) {
                significants.push(key);
            }
            insignificants.push(key);
        });

        // Zoomed out stars are the significant stars but are also displayed when zoomed in
        zoomedOutStars.forEach(({ id }) => {
            expect(significants.includes(id)).toBeTrue();
            expect(insignificants.includes(id)).toBeTrue();
        });

        // Insignificant stars should also be displayed when zoomed in
        zoomedInStars.forEach(({ id }) => {
            expect(insignificants.includes(id)).toBeTrue();
        });
    });
});

describe('Edge provider tests', () => {
    const zoomLevel = 1000;
    const provider = new DataProvider(3000, zoomLevel, 18);

    it('When zoomed out no edges should be provided', () => {
        expect(provider.giveEdges(0, 0, zoomLevel - 1, ['anutan'])).toHaveSize(
            0
        );
    });

    let edgeCount = 0;
    Object.values(edges).forEach(({ constellations }) => {
        constellations.forEach(({ edges: constellation }) => {
            constellation.forEach(() => {
                edgeCount += 1;
            });
        });
    });

    it('When zoomed in and radius set to max all edges should be returned', () => {
        expect(
            provider.giveEdges(0, 0, zoomLevel + 1, Object.keys(edges))
        ).toHaveSize(edgeCount);
    });

    it('When zoomed in, radius set to max but no cultures provided no edges should return', () => {
        expect(provider.giveEdges(0, 0, zoomLevel + 1, [])).toHaveSize(0);
    });
});

describe('Tests to determine whether x and y are provided correctly', () => {
    const lowestX = DataProvider.findLowestX();
    const lowestY = DataProvider.findLowestY();
    const middleX = DataProvider.findMiddleX();
    const middleY = DataProvider.findMiddleY();
    const highestX = DataProvider.findHighestX();
    const highestY = DataProvider.findHighestY();

    it('Lowest x should be lowest', () => {
        expect(lowestX <= middleX).toBeTrue();
        expect(lowestX <= highestX).toBeTrue();
    });

    it('Lowest y should be lowest', () => {
        expect(lowestY <= middleY).toBeTrue();
        expect(lowestY <= highestY).toBeTrue();
    });

    it('Middle x should be middle', () => {
        expect(lowestX <= middleX).toBeTrue();
        expect(middleX <= highestX).toBeTrue();
    });

    it('Middle y should be middle', () => {
        expect(lowestY <= middleY).toBeTrue();
        expect(middleY <= highestY).toBeTrue();
    });

    it('Highest x should be highest', () => {
        expect(highestX >= lowestX).toBeTrue();
        expect(highestX >= middleX).toBeTrue();
    });

    it('Highest y should be highest', () => {
        expect(highestY >= lowestY).toBeTrue();
        expect(highestY >= middleY).toBeTrue();
    });

    it('When arguments are provided, the function should error', () => {
        expect(() => {
            DataProvider.findLowestX('Argument');
        }).toThrow(ErrorFactory.tooManyArgumentsError(0, 1));
        expect(() => {
            DataProvider.findLowestY('Argument');
        }).toThrow(ErrorFactory.tooManyArgumentsError(0, 1));
        expect(() => {
            DataProvider.findMiddleX('Argument');
        }).toThrow(ErrorFactory.tooManyArgumentsError(0, 1));
        expect(() => {
            DataProvider.findMiddleY('Argument');
        }).toThrow(ErrorFactory.tooManyArgumentsError(0, 1));
        expect(() => {
            DataProvider.findHighestX('Argument');
        }).toThrow(ErrorFactory.tooManyArgumentsError(0, 1));
        expect(() => {
            DataProvider.findHighestY('Argument');
        }).toThrow(ErrorFactory.tooManyArgumentsError(0, 1));
    });
});

describe('Proper culture name tests', () => {
    const namedCultures = DataProvider.listNamedCultures();
    const cultures = DataProvider.listCultures();

    it('Size of both lists should be equivalent', () => {
        expect(namedCultures.length).toEqual(cultures.length);
    });

    it('Randomly selected cultures to test whether name is transferred correctly', () => {
        expect(DataProvider.getNamedCulture('anutan')).toEqual('Anutan');
        expect(DataProvider.getNamedCulture('arabic_al-sufi')).toEqual(
            'Arabic (Al-Sufi)'
        );
    });
});
