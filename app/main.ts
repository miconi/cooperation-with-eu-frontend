/**
 * @fileOverview Main file.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */


///<reference path="../typings/browser.d.ts" />

import $ = require('jquery');
import screenfull = require('screenfull');

import DataProvider = require("./DataProvider");
import MapController = require("./MapController");
import ThresholdController = require("./ThresholdController");


var dataProvider = new DataProvider(
    "data/connections.csv",
    "data/positions.csv"
);

var mapController = new MapController();
var thresholdController = new ThresholdController(dataProvider, mapController);

$('#fullscreen-button').click(() => {
    if (screenfull.enabled) {
        screenfull.toggle();

        setTimeout(function () {
            mapController = new MapController();
            thresholdController.setMapController(mapController);
        }, 500);
    }
});

