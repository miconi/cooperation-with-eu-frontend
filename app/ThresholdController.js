/**
 * @fileOverview ThresholdController class.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */
define(["require", "exports", 'jquery', 'noUiSlider', 'wNumb'], function (require, exports, $, noUiSlider, wNumb) {
    wNumb = window.wNumb;
    var ThresholdController = (function () {
        //------------------------ CONSTRUCTORS --------------------------
        function ThresholdController(dataProvider, mapController) {
            this.dataProvider = dataProvider;
            this.mapController = mapController;
            this.thresholdSlider = $('#threshold-slider')[0];
            dataProvider.getConnectionMinMax(this.initSlider.bind(this));
        }
        //------------------------ PRIVATE --------------------------
        ThresholdController.prototype.initSlider = function (error, minMax) {
            var _this = this;
            if (error === null) {
                var rangeMin = minMax[0];
                var rangeMax = minMax[1];
                var startMin = rangeMin + (rangeMax - rangeMin) / 6.5;
                var start = [startMin, rangeMax];
                var tooltipFormatter = wNumb({ decimals: 0 });
                noUiSlider.create(this.thresholdSlider, {
                    start: start,
                    tooltips: [tooltipFormatter, tooltipFormatter],
                    orientation: 'vertical',
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
    return ThresholdController;
});
