requirejs(["require", "linqjs", "jquery", "datamaps", "DataProvider"], function (require, Enumerable, $, Datamap) {
    var map = new Datamap({
        element: document.getElementById("basic"),
        projection: 'mercator'
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
        map.arc(connections, {strokeWidth: 1, arcSharpness: 1.4});
    }

});
