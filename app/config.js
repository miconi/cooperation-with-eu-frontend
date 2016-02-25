requirejs.config({
    // make components more sensible
    // expose jquery
    paths: {
        "components": "../bower_components",
        "d3": "../bower_components/d3/d3",
        "datamaps": "../bower_components/datamaps/dist/datamaps.world",
        "jquery": "../bower_components/jquery/dist/jquery",
        "jquery.bootstrap": "../bower_components/bootstrap/dist/js/bootstrap",
        "linqjs": "../bower_components/linqjs/linq",
        "queue": "../bower_components/d3-queue/d3-queue",
        "topojson": "../bower_components/topojson/topojson",
    },
    shim: {
        "jquery.bootstrap": {
            deps: ["jquery"]
        },
        topojson: {
            deps: ['d3'],
            exports: 'topojson'
        },
        datamaps: {
            deps: ['d3', 'topojson']
        },
        queue: {
            deps: ['d3']
        },
        DataProvider: {
            deps: ['queue', 'linqjs', 'ScaleFactory']
        }
    }
});

requirejs(['main']);

