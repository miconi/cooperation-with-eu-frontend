/**
 * @fileOverview DataProvider class.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */

///<reference path="../typings/main.d.ts" />

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
            .await(this.joinConnectionsWithPositionsCallback(callback, threshold));
    }

    /**
     * Gets connections as a TODO.
     */
    getConnections(callback) {
        d3.csv(this.connectionsUri, callback);
    }

    private joinConnectionsWithPositionsCallback(callback, threshold: number): any {
        function joinConnectionsWithPositions(connections: Connection[], positions: CountryPosition[]): any {
            return Enumerable.from(connections)
                .join(
                    Enumerable.from(positions),
                    "$.countryFrom",
                    "$.country",
                    function (connection, origin) {
                        return {
                            origin,
                            countryTo: connection.countryTo,
                            thickness: connection.thickness
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
                            thickness: connection.thickness,
                        };
                    }
                )
                .where("$.thickness > " + threshold)
                .toArray();
        }

        return function (error, connections: Connection[], positions: CountryPosition[]) {
            if (error !== null) {
                callback(error, null)
            } else {
                callback(error, joinConnectionsWithPositions(connections, positions));
            }
        }
    }


}

interface Connection {
    countryFrom: string;
    countryTo: string;
    thickness: string;
}

interface CountryPosition {
    country: string;
    latitude: string;
    longitude: string;
}


