requirejs(
    [
        "require",
        "linqjs",
        "jquery",
        "datamaps",
        "noUiSlider",
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

    });
