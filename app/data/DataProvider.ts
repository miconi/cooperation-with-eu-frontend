/**
 * @fileOverview DataProvider class.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */


///<reference path="../../typings/browser.d.ts" />

import d3 = require('d3');
import queue = require('queue');
import Enumerable = require('linqjs');

import {Connection, CountryPosition, JoinedConnection, ComputedConnection, MinMax, ComputedModel} from "./../data";
import MinMaxService from "./MinMaxService";


/**
 * Creates an instance of DataProvider.
 *
 * @constructor
 * @this {DataProvider}
 * @param {string} graphUri
 * @param {string} searchUri
 * @param {string} graphByIdUri
 */
export default class DataProvider {

    //------------------------ CONSTRUCTORS --------------------------

    constructor(private connectionsUri: string,
                private positionsUri: string) {
    }

    //------------------------ LOGIC --------------------------

    getConnectionMinMax(callback) {
        queue.queue()
            .defer(d3.csv, this.connectionsUri)
            .await(this.getConnectionMinMaxCallback(callback));
    }

    getConnectionsWithPositions(callback, threshold: number[]) {
        queue.queue()
            .defer(d3.csv, this.connectionsUri)
            .defer(d3.csv, this.positionsUri)
            .await(this.getConnectionsWithPositionsCallback(callback, threshold));
    }

    //------------------------ PRIVATE --------------------------

    private getConnectionMinMaxCallback(callback) {
        return function (error, connections: Connection[]): void {
            if (error !== null) {
                callback(error, null)
            } else {
                callback(error, MinMaxService.minMaxFromConnections(connections));
            }
        }
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
            var minMax = MinMaxService.minMaxFromConnections(filteredConnections);
            return addStroke(minMax, joinConnectionsWithPositions(filteredConnections, positions));
        }

        function addStroke(minMax: MinMax, connections: JoinedConnection[]): ComputedConnection[] {
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


}

