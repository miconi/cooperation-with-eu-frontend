/**
 * @fileOverview MapController class.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */


///<reference path="../typings/browser.d.ts" />

import Datamap = require('datamaps');

export = MapController;


class MapController {

    private map;

    //------------------------ CONSTRUCTORS --------------------------

    constructor() {

        document.getElementById("basic").innerHTML = "";

        this.map = new Datamap({
            element: document.getElementById("basic"),
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
        console.log("updateMap");
        if (error === null) {
            console.log(connections);
            this.map.arc(connections, {arcSharpness: 1.0});
            //map.updateChoropleth({
            //    US: { fillKey: 'authorHasTraveledTo' }
            //});
            var arcs = d3.selectAll('path.datamaps-arc');
            arcs
                .style('stroke', () => null)
                .style('stroke-opacity', (d) => d.strokeOpacity)
                .style('stroke-width', (d) => d.strokeWidth)
                .on("mouseover", (d) => $('#connectionInfo').text(d.origin.country + " — " + d.destination.country + ": " + d.value + " co-authored papers"))
            ;
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
            d3.selectAll("svg g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
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
