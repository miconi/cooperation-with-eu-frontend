/**
 * @fileOverview MapController class.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */
define(["require", "exports", 'jquery', 'datamaps'], function (require, exports, $, Datamap) {
    var MapController = (function () {
        //------------------------ CONSTRUCTORS --------------------------
        function MapController() {
            this.clearMapDiv();
            this.createDatamap();
            this.initZoom();
            this.modifyDatamapUpdatePopup();
        }
        //------------------------ LOGIC --------------------------
        MapController.prototype.updateMap = function (error, connections) {
            if (error === null) {
                this.map.arc(connections, {
                    arcSharpness: 1.0,
                    popupTemplate: this.popupTemplate("arc", function (d, data) { return d.origin.country + ' — ' + d.destination.country + ': ' + d.value; })
                });
            }
        };
        //------------------------ PRIVATE --------------------------
        MapController.prototype.popupTemplate = function (styleClass, descriptionGetter) {
            return function (d, data) {
                return '<div class="tooltip top ' + styleClass + '" style="opacity: 1; position: relative">' +
                    '<div class="tooltip-arrow"></div>' +
                    '<div class="tooltip-inner" style="white-space:nowrap">' +
                    descriptionGetter(d, data);
            };
            '</div>' +
                '</div>';
        };
        ;
        MapController.prototype.clearMapDiv = function () {
            $('#map').empty();
            $('#map').width(screen.width);
            $('#map').height(screen.height);
        };
        ;
        MapController.prototype.createDatamap = function () {
            this.map = new Datamap({
                element: $('#map')[0],
                projection: 'mercator',
                fills: {
                    defaultFill: "#b4dda8"
                },
                geographyConfig: {
                    popupTemplate: this.popupTemplate("country", function (d, data) { return d.properties.name; }),
                    popupOnHover: true,
                    highlightOnHover: true,
                    highlightFillColor: '#98cf7b',
                    highlightBorderColor: '#fff',
                    highlightBorderWidth: 1
                }
            });
        };
        ;
        MapController.prototype.modifyDatamapUpdatePopup = function () {
            Datamap.prototype.updatePopup = function (element, d, options) {
                var self = this;
                element.on('mousemove', null);
                element.on('mousemove', function () {
                    var position = d3.mouse(self.options.element);
                    d3.select(self.svg[0][0].parentNode).select('.datamaps-hoverover')
                        .html(function () {
                        var data = JSON.parse(element.attr('data-info'));
                        try {
                            return options.popupTemplate(d, data);
                        }
                        catch (e) {
                            return "";
                        }
                    })
                        .style('top', function () {
                        var height = $(this).height();
                        return (position[1] - height - 8) + "px";
                    })
                        .style('left', function () {
                        var width = $(this).width();
                        return (position[0] - width / 2) + "px";
                    });
                });
                d3.select(self.svg[0][0].parentNode).select('.datamaps-hoverover').style('display', 'block');
            };
        };
        ;
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
        };
        return MapController;
    })();
    exports.__esModule = true;
    exports["default"] = MapController;
});
