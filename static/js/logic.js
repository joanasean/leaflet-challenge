// An array of earthquakes and their features (type, properties, geometry, ID)
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var latlng = [];





d3.json(url, function(error,data){
    if (error) console.log(error)

    createFeatures(data.features)


});

function getColor(mag){
    return mag > 4.0 ? "#660000":
        mag > 2.8 ? "#b30000":
        "#ff6666";
};

function createFeatures(earthquakeData){

    function onEachFeature(feature, layer){
        layer.bindPopup("<h3>" + feature.properties.title +
        "</h3><hr><p>" + new Date(feature.properties.time) + "<p>")



    }
//var latlng = L.latlng(feature.geometry.coordinates.slice(0,2))
// function getColor(mag){
//     return mag >= 4.0 ? "#660000":
//         mag >= 2.8 ? "#b30000":
//         "#ff6666";
// };

var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng){
        return L.circleMarker(latlng, {radius: feature.properties.mag * 4, color: getColor(feature.properties.mag)})
    }
});

createMap(earthquakes);
}

function createMap(earthquakes) {
// Define map layers 
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

var baseMaps = {
"Street Map": streetmap,
"Dark Map": darkmap
};

 // Create overlay object to hold our overlay layer
 var overlayMaps = {
    Earthquakes: earthquakes
  };

var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
collapsed: false
}).addTo(myMap);

  //legend
  var legend = L.control({
    position: "bottomright"
});

// Then add all the details for the legend
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0, 1, 2, 3, 4, 5];

    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            "<i style='background: " + getColor(grades[i]) + "'></i> " +
            grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }

    return div;
};
// Finally, we our legend to the map.
legend.addTo(myMap);


}


// An array which will be used to store created eqMarkers
//var eqMarkers=[];