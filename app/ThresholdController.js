var noUiSlider = require('noUiSlider');
var ThresholdController = (function () {
    //------------------------ CONSTRUCTORS --------------------------
    function ThresholdController(dataProvider, mapController) {
        this.dataProvider = dataProvider;
        this.mapController = mapController;
        this.thresholdSlider = document.getElementById('threshold-slider');
        dataProvider.getConnectionMinMax(this.initSlider.bind(this));
    }
    ThresholdController.prototype.setMapController = function (mapController) {
        this.mapController = mapController;
        this.onThresholdUpdate();
    };
    //------------------------ PRIVATE --------------------------
    ThresholdController.prototype.initSlider = function (error, minMax) {
        var _this = this;
        if (error === null) {
            var rangeMin = minMax[0];
            var rangeMax = minMax[1];
            var startMin = rangeMin + (rangeMax - rangeMin) / 6.5;
            var start = [startMin, rangeMax];
            noUiSlider.create(this.thresholdSlider, {
                start: start,
                connect: true,
                range: {
                    'min': rangeMin,
                    '70%': [startMin],
                    '90%': [rangeMax - (rangeMax - rangeMin) / 6.5],
                    'max': rangeMax
                }
            });
            this.thresholdSlider.noUiSlider.on('update', function () { return _this.onThresholdUpdate(); });
        }
    };
    ThresholdController.prototype.onThresholdUpdate = function () {
        var threshold = this.thresholdSlider.noUiSlider.get();
        this.dataProvider.getConnectionsWithPositions(this.mapController.updateMap.bind(this.mapController), threshold);
    };
    return ThresholdController;
})();
