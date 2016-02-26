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
    constructor(private connectionsUri: string) {
    }

    getConnectionsWithPositions(callback, threshold: number) {
        queue.queue()
            .defer(d3.csv, "data/connections.csv")
            .defer(d3.csv, "data/positions.csv")
            .await(this.processDataCallback(callback, threshold));
    }

    /**
     * Gets connections as a TODO.
     */
    getConnections(callback) {
        d3.csv(this.connectionsUri, callback);
    }

    private processDataCallback(callback, threshold: number): ComputedConnection[] {

        function processData(connections: Connection[], positions: CountryPosition[]): ComputedConnection[] {
            return scaleThickness(joinConnectionsWithPositions(connections, positions));
        }

        function scaleThickness(connections: JoinedConnection[]): ComputedConnection[] {
            var thicknesses: number[] = Enumerable.from(connections)
                .select("Number($.value)")
                .toArray();
            var scale = ScaleFactory.newLinearFromValues(thicknesses).range([1.5, 5.0]);
            console.log(scale(30000));
            console.log(thicknesses);

            return Enumerable.from(connections)
                .select(function (connection) {
                    return {
                        origin: connection.origin,
                        destination: connection.destination,
                        strokeWidth: scale(Number(connection.value)),
                        value: connection.value
                    };
                })
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
                            value: connection.value
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
                .where("$.value > " + threshold)
                .toArray();
        }

        return function (error, connections: Connection[], positions: CountryPosition[]) {
            if (error !== null) {
                callback(error, null)
            } else {
                callback(error, processData(connections, positions));
            }
        }
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
    value: string;
}

interface ComputedConnection {
    origin: CountryPosition;
    destination: CountryPosition;
    strokeWidth: number;
    value: number;
}

