const airports = require('data/airports')
function startClustering(map, data) {
  var dataPoints = data.map(function (item) {
    return new H.clustering.DataPoint(item.latitude, item.longitude);
  });

  var clusteredDataProvider = new H.clustering.Provider(dataPoints, {
    clusteringOptions: {
      eps: 32,
      minWeight: 2,
    },
  });

  var clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);
  map.addLayer(clusteringLayer);
}

var platform = new H.service.Platform({
  apikey: mapToken,
});

var defaultLayers = platform.createDefaultLayers();

var map = new H.Map(
  document.getElementById("cluster-map"),
  defaultLayers.vector.normal.map,
  {
    center: new H.geo.Point(30.789, 33.79),
    zoom: 2,
    pixelRatio: window.devicePixelRatio || 1,
  }
);
window.addEventListener("resize", () => map.getViewPort().resize());

var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

var ui = H.ui.UI.createDefault(map, defaultLayers);

startClustering(map, airports);
