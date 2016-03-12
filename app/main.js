/**
 * @fileOverview Main file.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */
define(["require", "exports", 'jquery', 'screenfull', "./DataProvider", "./MapController", "./ThresholdController"], function (require, exports, $, screenfull, DataProvider, MapController, ThresholdController) {
    var dataProvider = new DataProvider("data/connections.csv", "data/positions.csv");
    var mapController = new MapController();
    var thresholdController = new ThresholdController(dataProvider, mapController);
    $('#fullscreen-button').click(function () {
        if (screenfull.enabled) {
            screenfull.toggle();
            setTimeout(function () {
                mapController = new MapController();
                thresholdController.setMapController(mapController);
            }, 500);
        }
    });
});
