///<reference path="../typings/main.d.ts" />

var Datamap = require('datamaps');

class MapController {

    constructor() {
        this.initZoom();
    }

    private map = new Datamap({
        element: document.getElementById("basic"),
        projection: 'mercator',
        fills: {
            defaultFill: "#b4dda8"
            //authorHasTraveledTo: "#fa0fa0"
        }
    });


    updateMap(error, connections) {
        if (error === null) {
            console.log(connections);
            this.map.arc(connections, {animationSpeed: 0, arcSharpness: 1.0});
            //map.updateChoropleth({
            //    US: { fillKey: 'authorHasTraveledTo' }
            //});
            var arcs = d3.selectAll('path.datamaps-arc');
            arcs
                .style('stroke', function (datum) {
                    return null;
                })
                .on("mouseover", function (d) {
                    console.log(d);
                    $('#connectionInfo').text(d.origin.country + " — " + d.destination.country + ": " + d.value + " co-authored papers");
                });
        }
    }

    /**
     * Zooming & dragging bahaviour, based on
     * https://bl.ocks.org/mbostock/6123708
     */
    private initZoom(): void {
        var zoom = d3.behavior.zoom()
            .scaleExtent([1, 10])
            .on("zoom", zoomed);

        var drag = d3.behavior.drag()
            .origin(function (d) {
                return d;
            })
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