require(
    [
        "require",
        "DataProvider",
        "MapController",
        "ThresholdController",
        "jquery",
        "screenfull",
    ], function (require, DataProvider, MapController, ThresholdController) {

        var dataProvider = new DataProvider(
            "data/connections.csv",
            "data/positions.csv"
        );

        var mapController = new MapController();
        var thresholdController = new ThresholdController(dataProvider, mapController);

        $('#fullscreen-button').click(function () {
            if (screenfull.enabled) {
                screenfull.toggle();

                setTimeout(function() {
                    mapController = new MapController();
                    thresholdController.setMapController(mapController);
                }, 500);
            }
        });

    });
