/**
 * @fileOverview DataProvider class.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */
define(["require", "exports", 'd3', 'queue', 'linqjs', "./MinMaxService"], function (require, exports, d3, queue, Enumerable, MinMaxService_1) {
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
        //------------------------ CONSTRUCTORS --------------------------
        function DataProvider(connectionsUri, positionsUri) {
            this.connectionsUri = connectionsUri;
            this.positionsUri = positionsUri;
        }
        //------------------------ LOGIC --------------------------
        DataProvider.prototype.getConnectionMinMax = function (callback) {
            queue.queue()
                .defer(d3.csv, this.connectionsUri)
                .await(this.getConnectionMinMaxCallback(callback));
        };
        DataProvider.prototype.getConnectionsWithPositions = function (callback, threshold) {
            queue.queue()
                .defer(d3.csv, this.connectionsUri)
                .defer(d3.csv, this.positionsUri)
                .await(this.getConnectionsWithPositionsCallback(callback, threshold));
        };
        //------------------------ PRIVATE --------------------------
        DataProvider.prototype.getConnectionMinMaxCallback = function (callback) {
            return function (error, connections) {
                if (error !== null) {
                    callback(error, null);
                }
                else {
                    callback(error, MinMaxService_1["default"].minMaxFromConnections(connections));
                }
            };
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
                var minMax = MinMaxService_1["default"].minMaxFromConnections(filteredConnections);
                return addStroke(minMax, joinConnectionsWithPositions(filteredConnections, positions));
            }
            function addStroke(minMax, connections) {
                var widthScale = d3.scale.linear()
                    .domain(minMax)
                    .range([1.5, 6.0]);
                var opacityScale = d3.scale.linear()
                    .domain(minMax)
                    .range([0.3, 1.0]);
                return Enumerable.from(connections)
                    .select(function (connection) {
                    return {
                        origin: connection.origin,
                        destination: connection.destination,
                        strokeWidth: widthScale(connection.value),
                        strokeOpacity: opacityScale(connection.value),
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
        return DataProvider;
    })();
    exports.__esModule = true;
    exports["default"] = DataProvider;
});
