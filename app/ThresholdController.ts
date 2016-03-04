var noUiSlider = require('noUiSlider');

class ThresholdController {

    //------------------------ CONSTRUCTORS --------------------------

    constructor(private dataProvider: DataProvider,
                private mapController: MapController) {

        dataProvider.getConnectionMinMax(this.initSlider.bind(this));
    }

    //------------------------ PRIVATE --------------------------

    private thresholdSlider = document.getElementById('threshold-slider');

    private initSlider(error, minMax) {
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

            this.thresholdSlider.noUiSlider.on(
                'update',
                this.changeThreshold.bind(this)
            );
        }
    }

    private changeThreshold() {
        var threshold = this.thresholdSlider.noUiSlider.get();
        this.dataProvider.getConnectionsWithPositions(
            this.mapController.updateMap.bind(this.mapController),
            threshold);
    }

}
