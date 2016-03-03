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
    function DataProvider(connectionsUri, positionsUri) {
        this.connectionsUri = connectionsUri;
        this.positionsUri = positionsUri;
    }
    DataProvider.prototype.getConnectionMinMax = function (callback) {
        queue.queue()
            .defer(d3.csv, this.connectionsUri)
            .await(this.getConnectionMinMaxCallback(callback));
    };
    DataProvider.prototype.getConnectionMinMaxCallback = function (callback) {
        return function (error, connections) {
            if (error !== null) {
                callback(error, null);
            }
            else {
                callback(error, DataProvider.minMaxFromConnections(connections));
            }
        };
    };
    DataProvider.prototype.getConnectionsWithPositions = function (callback, threshold) {
        queue.queue()
            .defer(d3.csv, this.connectionsUri)
            .defer(d3.csv, this.positionsUri)
            .await(this.getConnectionsWithPositionsCallback(callback, threshold));
    };
    DataProvider.prototype.getConnectionsWithPositionsCallback = function (callback, threshold) {
        return function (error, connections, positions) {
            if (error !== null) {
                callback(error, null);
            }
            else {
                callback(error, processData(connections, positions));
            }
        };
        function processData(connections, positions) {
            var filteredConnections = filterConnections(connections);
            var minMax = DataProvider.minMaxFromConnections(filteredConnections);
            return addStrokeWidth(minMax, joinConnectionsWithPositions(filteredConnections, positions));
        }
        function addStrokeWidth(minMax, connections) {
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
        function filterConnections(connections) {
            return Enumerable.from(connections)
                .where("$.value >= " + threshold[0])
                .where("$.value <= " + threshold[1])
                .toArray();
        }
        function joinConnectionsWithPositions(connections, positions) {
            return Enumerable.from(connections)
                .join(Enumerable.from(positions), "$.countryFrom", "$.country", function (connection, origin) {
                return {
                    origin: origin,
                    countryTo: connection.countryTo,
                    value: Number(connection.value)
                };
            })
                .join(Enumerable.from(positions), "$.countryTo", "$.country", function (connection, destination) {
                return {
                    origin: connection.origin,
                    destination: destination,
                    value: connection.value
                };
            })
                .toArray();
        }
    };
    DataProvider.minMaxFromConnections = function (connections) {
        var values = Enumerable.from(connections)
            .select("Number($.value)")
            .toArray();
        return [d3.min(values), d3.max(values)];
    };
    return DataProvider;
})();
