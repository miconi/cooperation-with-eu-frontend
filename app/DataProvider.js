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
var DataProvider = (function () {
    function DataProvider(connectionsUri) {
        this.connectionsUri = connectionsUri;
    }
    DataProvider.prototype.getConnectionsWithPositions = function (callback, threshold) {
        queue.queue()
            .defer(d3.csv, "data/connections.csv")
            .defer(d3.csv, "data/positions.csv")
            .await(this.processDataCallback(callback, threshold));
    };
    /**
     * Gets connections as a TODO.
     */
    DataProvider.prototype.getConnections = function (callback) {
        d3.csv(this.connectionsUri, callback);
    };
    DataProvider.prototype.processDataCallback = function (callback, threshold) {
        function processData(connections, positions) {
            return scaleThickness(joinConnectionsWithPositions(connections, positions));
        }
        function scaleThickness(connections) {
            var thicknesses = Enumerable.from(connections)
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
        function joinConnectionsWithPositions(connections, positions) {
            return Enumerable.from(connections)
                .join(Enumerable.from(positions), "$.countryFrom", "$.country", function (connection, origin) {
                return {
                    origin: origin,
                    countryTo: connection.countryTo,
                    value: connection.value
                };
            })
                .join(Enumerable.from(positions), "$.countryTo", "$.country", function (connection, destination) {
                return {
                    origin: connection.origin,
                    destination: destination,
                    value: connection.value
                };
            })
                .where("$.value > " + threshold)
                .toArray();
        }
        return function (error, connections, positions) {
            if (error !== null) {
                callback(error, null);
            }
            else {
                callback(error, processData(connections, positions));
            }
        };
    };
    return DataProvider;
})();
