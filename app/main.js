/**
 * @fileOverview Main file.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */
define(["require", "exports", 'jquery', 'screenfull', "./DataProvider", "./MapController", "./ThresholdController"], function (require, exports, $, screenfull, DataProvider, MapController, ThresholdController) {
    screenfull = window.screenfull; // something is wrong with the screenfull.js module definition
    //------------------------ LOGIC --------------------------
    var dataProvider = new DataProvider("data/connections.csv", "data/positions.csv");
    var mapController = new MapController();
    var thresholdController = new ThresholdController(dataProvider, mapController);
    $('#fullscreen-button').click(function () {
        if (screenfull.enabled) {
            screenfull.toggle();
        }
    });
});
