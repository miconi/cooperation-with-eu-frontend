/**
 * @fileOverview MapController class.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */


///<reference path="../typings/browser.d.ts" />

import $ = require('jquery');
import Datamap = require('datamaps');

export = MapController;


class MapController {

    private map;

    //------------------------ CONSTRUCTORS --------------------------

    constructor() {

        $('#map').empty();

        $('#map').width(screen.width);
        $('#map').height(screen.height);

        this.map = new Datamap({
            element: $('#map')[0],
            projection: 'mercator',
            fills: {
                defaultFill: "#b4dda8"
                //authorHasTraveledTo: "#fa0fa0"
            }
        });

        this.initZoom();
    }

    //------------------------ LOGIC --------------------------

    updateMap(error, connections) {
        if (error === null) {
            this.map.arc(connections, {arcSharpness: 1.0});
        }
    }

    //------------------------ PRIVATE --------------------------

    /**
     * Zooming & dragging bahaviour, based on
     * https://bl.ocks.org/mbostock/6123708
     */
    private initZoom(): void {
        var zoom = d3.behavior.zoom()
            .scaleExtent([1, 10])
            .on("zoom", zoomed);

        var drag = d3.behavior.drag()
            .origin((d) => d)
            .on("dragstart", dragstarted)
            .on("drag", dragged)
            .on("dragend", dragended);

        d3.selectAll("svg").call(zoom);

        function zoomed() {
            d3.selectAll("svg > g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

        function dragstarted(d) {
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed("dragging", true);
        }

        function dragged(d) {
            d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
        }

        function dragended(d) {
            d3.select(this).classed("dragging", false);
        }
    }
}
