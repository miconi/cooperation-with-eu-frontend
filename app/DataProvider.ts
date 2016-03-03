/**
 * @fileOverview DataProvider class.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */

///<reference path="../typings/main.d.ts" />
///<reference path="ScaleFactory.ts"/>

var queue = require('queue');
var Enumerable = require('linqjs');

/**
 * Creates an instance of DataProvider.
 *
 * @constructor
 * @this {DataProvider}
 * @param {string} graphUri
 * @param {string} searchUri
 * @param {string} graphByIdUri
 */
class DataProvider {
    constructor(private connectionsUri: string, private positionsUri: string) {
    }

    getConnectionMinMax(callback) {
        queue.queue()
            .defer(d3.csv, this.connectionsUri)
            .await(this.getConnectionMinMaxCallback(callback));
    }

    private getConnectionMinMaxCallback(callback) {
        return function (error, connections: Connection[]): void {
            if (error !== null) {
                callback(error, null)
            } else {
                callback(error, DataProvider.minMaxFromConnections(connections));
            }
        }
    }

    getConnectionsWithPositions(callback, threshold: number[]) {
        queue.queue()
            .defer(d3.csv, this.connectionsUri)
            .defer(d3.csv, this.positionsUri)
            .await(this.getConnectionsWithPositionsCallback(callback, threshold));
    }

    private getConnectionsWithPositionsCallback(callback, threshold: number[]) {

        return function (error, connections: Connection[], positions: CountryPosition[]): void {
            if (error !== null) {
                callback(error, null)
            } else {
                callback(error, processData(connections, positions));
            }
        };

        function processData(connections: Connection[], positions: CountryPosition[]): ComputedConnection[] {
            var filteredConnections = filterConnections(connections);
            var minMax = DataProvider.minMaxFromConnections(filteredConnections);
            return addStrokeWidth(minMax, joinConnectionsWithPositions(filteredConnections, positions));
        }

        function addStrokeWidth(minMax: MinMax, connections: JoinedConnection[]): ComputedConnection[] {
            var scale = d3.scale.linear()
                .domain(minMax)
                .range([1.5, 7.0]);

            return Enumerable.from(connections)
                .select(function (connection) {
                    return {
                        origin: connection.origin,
                        destination: connection.destination,
                        strokeWidth: scale(connection.value),
                        value: connection.value
                    };
                })
                .toArray();
        }

        function filterConnections(connections: Connection[]): Connection[] {
            return Enumerable.from(connections)
                .where("$.value >= " + threshold[0])
                .where("$.value <= " + threshold[1])
                .toArray();
        }

        function joinConnectionsWithPositions(connections: Connection[], positions: CountryPosition[]): JoinedConnection[] {
            return Enumerable.from(connections)
                .join(
                    Enumerable.from(positions),
                    "$.countryFrom",
                    "$.country",
                    function (connection, origin) {
                        return {
                            origin,
                            countryTo: connection.countryTo,
                            value: Number(connection.value),
                        };
                    }
                )
                .join(
                    Enumerable.from(positions),
                    "$.countryTo",
                    "$.country",
                    function (connection, destination) {
                        return {
                            origin: connection.origin,
                            destination,
                            value: connection.value,
                        };
                    }
                )
                .toArray();
        }
    }

    private static minMaxFromConnections(connections): MinMax {
        var values: number[] = Enumerable.from(connections)
            .select("Number($.value)")
            .toArray();
        return [d3.min(values), d3.max(values)];
    }


}

interface Connection {
    countryFrom: string;
    countryTo: string;
    value: string;
}

interface CountryPosition {
    country: string;
    latitude: string;
    longitude: string;
}

interface JoinedConnection {
    origin: CountryPosition;
    destination: CountryPosition;
    value: number;
}

interface ComputedConnection {
    origin: CountryPosition;
    destination: CountryPosition;
    strokeWidth: number;
    value: number;
}

/**
 * First element is min, second is max.
 */
type MinMax = number[]

interface ComputedModel {
    connections: ComputedConnection[];
    minMax: MinMax
}
