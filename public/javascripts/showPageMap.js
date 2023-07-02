var platform = new H.service.Platform({
  apikey: mapToken,
});
var defaultLayers = platform.createDefaultLayers();
var map = new H.Map(
  document.getElementById("map"),
  defaultLayers.vector.normal.map,
  {
    center: campground.geometry,
    zoom: 8,
    pixelRatio: window.devicePixelRatio || 1,
  }
);
window.addEventListener("resize", () => map.getViewPort().resize());
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
var parisMarker = new H.map.Marker(campground.geometry);
map.addObject(parisMarker);
