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
            })
        ;

    }

});
