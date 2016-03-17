/**
 * @fileOverview Config file.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */


require.config({
    paths: {
        "components": "../bower_components",
        "d3": "../bower_components/d3/d3",
        "datamaps": "../bower_components/datamaps/dist/datamaps.world",
        "jquery": "../bower_components/jquery/dist/jquery",
        "linqjs": "../bower_components/linqjs/linq",
        "noUiSlider": "../bower_components/nouislider/distribute/nouislider",
        "queue": "../bower_components/d3-queue/d3-queue",
        "screenfull": "../bower_components/screenfull/dist/screenfull",
        "topojson": "../bower_components/topojson/topojson",
    }
});

require(['main']);

