requirejs(["require", "linqjs", "jquery", "datamaps", "DataProvider"], function(require, Enumerable, $, Datamap) {
    //$("#testDiv").html("hello");
    var map = new Datamap({
        element: document.getElementById("basic"),
        projection: 'mercator'
    });
    var dataProvider = new DataProvider("data/connections.csv");

    dataProvider.getConnectionsWithPositions(makeMyMap);

    function makeMyMap(error, connections) {
        console.log(connections[0]);
        //map.arc(connections, {strokeWidth: 1, arcSharpness: 1.4});
        console.log(connections);
        map.arc(connections,  {strokeWidth: 1, arcSharpness: 1.4});
        //map.arc([connections[0]],  {strokeWidth: 1, arcSharpness: 1.4});
    }
    map.arc([
        {origin: {country: "AD", latitude: "42.5000", longitude: "1.5000"}, destination: {country: "BR", latitude: "-10.0000", longitude: "-55.0000"}, thickness: "10"}
    ],  {strokeWidth: 1, arcSharpness: 1.4});

    //map.arc([
    //    {
    //        origin: {
    //            latitude: 40.639722,
    //            longitude: -73.778889
    //        },
    //        destination: {
    //            latitude: 37.618889,
    //            longitude: -122.375
    //        }
    //    },
    //    {
    //        origin: {
    //            latitude: 30.194444,
    //            longitude: -97.67
    //        },
    //        destination: {
    //            latitude: 25.793333,
    //            longitude: -80.290556
    //        },
    //        options: {
    //            strokeWidth: 2,
    //            strokeColor: 'rgba(100, 10, 200, 0.4)',
    //        }
    //    },
    //    {
    //        origin: {
    //            latitude: 39.861667,
    //            longitude: -104.673056
    //        },
    //        destination: {
    //            latitude: 35.877778,
    //            longitude: -78.7875
    //        }
    //    }
    //],  {strokeWidth: 1, arcSharpness: 1.4});

});
