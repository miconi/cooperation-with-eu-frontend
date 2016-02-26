requirejs(["require", "linqjs", "jquery", "datamaps", "DataProvider"], function (require, Enumerable, $, Datamap) {
    var map = new Datamap({
        element: document.getElementById("basic"),
        projection: 'mercator',
        fills: {
            defaultFill: "#b4dda8",
            //authorHasTraveledTo: "#fa0fa0"
        }
    });
    var dataProvider = new DataProvider("data/connections.csv");
    changeThreshold();

    $("#threshold-button").click(changeThreshold);
    $("#threshold-input").keyup(function (e) {
        if (e.keyCode === 13) {
            changeThreshold();
        }
    });

    function changeThreshold() {
        var threshold = $("#threshold-input").val();
        dataProvider.getConnectionsWithPositions(updateMap, threshold);
    }

    function updateMap(error, connections) {
        console.log(connections);
        map.arc(connections, {arcSharpness: 1.4});
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


    // Zooming & dragging bahaviour, based on
    // https://bl.ocks.org/mbostock/6123708
    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);

    var drag = d3.behavior.drag()
        .origin(function(d) { return d; })
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
});
