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
var DataProvider = (function () {
    function DataProvider(connectionsUri) {
        this.connectionsUri = connectionsUri;
    }
    DataProvider.prototype.getConnectionsWithPositions = function (callback, threshold) {
        queue.queue()
            .defer(d3.csv, "data/connections.csv")
            .defer(d3.csv, "data/positions.csv")
            .await(this.joinConnectionsWithPositionsCallback(callback, threshold));
    };
    /**
     * Gets connections as a TODO.
     */
    DataProvider.prototype.getConnections = function (callback) {
        d3.csv(this.connectionsUri, callback);
    };
    DataProvider.prototype.joinConnectionsWithPositionsCallback = function (callback, threshold) {
        function joinConnectionsWithPositions(connections, positions) {
            return Enumerable.from(connections)
                .join(Enumerable.from(positions), "$.countryFrom", "$.country", function (connection, origin) {
                return {
                    origin: origin,
                    countryTo: connection.countryTo,
                    thickness: connection.thickness
                };
            })
                .join(Enumerable.from(positions), "$.countryTo", "$.country", function (connection, destination) {
                return {
                    origin: connection.origin,
                    destination: destination,
                    thickness: connection.thickness
                };
            })
                .where("$.thickness > " + threshold)
                .toArray();
        }
        return function (error, connections, positions) {
            if (error !== null) {
                callback(error, null);
            }
            else {
                callback(error, joinConnectionsWithPositions(connections, positions));
            }
        };
    };
    return DataProvider;
})();
