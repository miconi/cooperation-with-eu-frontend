/**
 * @fileOverview ThresholdController class.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */


///<reference path="../typings/browser.d.ts" />

import $ = require('jquery');
import noUiSlider = require('noUiSlider');
import wNumb = require('wNumb');
wNumb = window.wNumb;

import DataProvider = require("./DataProvider");
import MapController = require("./MapController");

export = ThresholdController;


class ThresholdController {

    private thresholdSlider = $('#threshold-slider')[0];

    //------------------------ CONSTRUCTORS --------------------------

    constructor(private dataProvider: DataProvider,
                private mapController: MapController) {

        dataProvider.getConnectionMinMax(this.initSlider.bind(this));
    }

    //------------------------ PRIVATE --------------------------

    private initSlider(error, minMax) {
        if (error === null) {

            var rangeMin = minMax[0];
            var rangeMax = minMax[1];
            var startMin = rangeMin + (rangeMax - rangeMin) / 6.5;
            var start = [startMin, rangeMax];

            const tooltipFormatter = wNumb({ decimals: 0 });

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

            this.thresholdSlider.noUiSlider.on(
                'update',
                () => this.onThresholdUpdate()
            );
        }
    }

    private onThresholdUpdate() {
        var threshold = this.thresholdSlider.noUiSlider.get();
        this.dataProvider.getConnectionsWithPositions(
            this.mapController.updateMap.bind(this.mapController),
            threshold);
    }

}
