requirejs(
    [
        "require",
        "linqjs",
        "jquery",
        "datamaps",
        "noUiSlider",
        "screenfull",
        "DataProvider",
        "MapController",
        "ThresholdController"
    ], function () {

        var dataProvider = new DataProvider(
            "data/connections.csv",
            "data/positions.csv"
        );
        var mapController = new MapController();
        var thresholdController = new ThresholdController(dataProvider, mapController);

        $('#fullscreen-button').click(function () {
            if (screenfull.enabled) {
                screenfull.toggle();
            } else {
            }
        });
        
    });
