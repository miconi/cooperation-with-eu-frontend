/**
 * @fileOverview DataProvider class.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */

///<reference path="../typings/main.d.ts" />

queue = require('queue')

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

    getConnectionsWithPositions(callback) {
        queue.queue()
            .defer(d3.csv, "data/connections.csv")
            .defer(d3.csv, "data/connections.csv")
            .await(callback); // function that uses files
    }

    /**
     * Gets connections as a TODO.
     */
    getConnections(callback) {
        d3.csv(this.connectionsUri, callback);
    }
}

