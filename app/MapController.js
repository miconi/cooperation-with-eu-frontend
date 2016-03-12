/**
 * @fileOverview MapController class.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */
define(["require", "exports", 'datamaps'], function (require, exports, Datamap) {
    var MapController = (function () {
        //------------------------ CONSTRUCTORS --------------------------
        function MapController() {
            document.getElementById("basic").innerHTML = "";
            this.map = new Datamap({
                element: document.getElementById("basic"),
                projection: 'mercator',
                fills: {
                    defaultFill: "#b4dda8"
                }
            });
            this.initZoom();
        }
        //------------------------ LOGIC --------------------------
        MapController.prototype.updateMap = function (error, connections) {
            console.log("updateMap");
            if (error === null) {
                console.log(connections);
                this.map.arc(connections, { arcSharpness: 1.0 });
                //map.updateChoropleth({
                //    US: { fillKey: 'authorHasTraveledTo' }
                //});
                var arcs = d3.selectAll('path.datamaps-arc');
                arcs
                    .style('stroke', function () { return null; })
                    .style('stroke-opacity', function (d) { return d.strokeOpacity; })
                    .style('stroke-width', function (d) { return d.strokeWidth; })
                    .on("mouseover", function (d) { return $('#connectionInfo').text(d.origin.country + " — " + d.destination.country + ": " + d.value + " co-authored papers"); });
            }
        };
        //------------------------ PRIVATE --------------------------
        /**
         * Zooming & dragging bahaviour, based on
         * https://bl.ocks.org/mbostock/6123708
         */
        MapController.prototype.initZoom = function () {
            var zoom = d3.behavior.zoom()
                .scaleExtent([1, 10])
                .on("zoom", zoomed);
            var drag = d3.behavior.drag()
                .origin(function (d) { return d; })
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
        };
        return MapController;
    })();
    return MapController;
});
