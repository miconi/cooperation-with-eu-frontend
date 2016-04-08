/**
 * @fileOverview Main file.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */
define(["require", "exports", 'jquery', 'screenfull', "./data/DataProvider", "./MapController", "./ThresholdController"], function (require, exports, $, screenfull, DataProvider_1, MapController_1, ThresholdController_1) {
    screenfull = window.screenfull; // something is wrong with the screenfull.js module definition
    //------------------------ LOGIC --------------------------
    var dataProvider = new DataProvider_1["default"]("data/connections.csv", "data/positions.csv");
    var mapController = new MapController_1["default"]();
    var thresholdController = new ThresholdController_1["default"](dataProvider, mapController);
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
    $('#fullscreen-button').click(function () {
        if (screenfull.enabled) {
            screenfull.toggle();
        }
    });
});
