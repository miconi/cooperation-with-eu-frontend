requirejs(["require", "linqjs", "jquery", "datamaps", "DataProvider"], function(require, Enumerable, $, Datamap) {
    var map = new Datamap({
        element: document.getElementById("basic"),
        projection: 'mercator'
    });
    var dataProvider = new DataProvider("data/connections.csv");

    dataProvider.getConnectionsWithPositions(makeMyMap, 20000);

    function makeMyMap(error, connections) {
        console.log(connections);
        map.arc(connections,  {strokeWidth: 1, arcSharpness: 1.4});
    }

});
