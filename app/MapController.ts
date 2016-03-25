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
        this.clearMapDiv();
        this.createDatamap();
        this.initZoom();
        this.modifyDatamapUpdatePopup();
    }

    //------------------------ LOGIC --------------------------

    updateMap(error, connections) {
        if (error === null) {
            this.map.arc(connections, {
                arcSharpness: 1.0,
                popupTemplate: this.popupTemplate("arc", (d, data) => d.origin.country + ' — ' + d.destination.country + ': ' + d.value)
            });
        }
    }

    //------------------------ PRIVATE --------------------------

    private popupTemplate(styleClass: string, descriptionGetter) {
        return (d, data) =>
        '<div class="tooltip top ' + styleClass + '" style="opacity: 1; position: relative">' +
        '<div class="tooltip-arrow"></div>' +
        '<div class="tooltip-inner" style="white-space:nowrap">' +
        descriptionGetter(d, data)
        '</div>' +
        '</div>';
    };

    private clearMapDiv() {
        $('#map').empty();

        $('#map').width(screen.width);
        $('#map').height(screen.height);
    };

    private createDatamap() {
        this.map = new Datamap({
            element: $('#map')[0],
            projection: 'mercator',
            fills: {
                defaultFill: "#b4dda8"
                //authorHasTraveledTo: "#fa0fa0"
            },
            geographyConfig: {
                popupTemplate: this.popupTemplate("country", (d, data) => d.properties.name),
                popupOnHover: true,
                highlightOnHover: true,
                highlightFillColor: '#98cf7b',
                highlightBorderColor: '#fff',
                highlightBorderWidth: 1,
                //highlightBorderOpacity: 1
            }
        });
    };

    private modifyDatamapUpdatePopup() {
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
                        } catch (e) {
                            return "";
                        }
                    })
                    .style('top', function () {
                        const height = $(this).height();
                        return (position[1] - height - 8) + "px"
                    })
                    .style('left', function () {
                        const width = $(this).width();
                        return (position[0] - width / 2) + "px"
                    });
            });

            d3.select(self.svg[0][0].parentNode).select('.datamaps-hoverover').style('display', 'block');
        };
    };

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
