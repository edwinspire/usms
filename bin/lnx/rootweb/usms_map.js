
require(["dojo/ready", "dojox/geo/openlayers/Map", 'dojo/request', 'jspire/request/Xml', 
          "dojox/geo/openlayers/WidgetFeature", "dojox/geo/openlayers/Layer", "_usms_mappoint/_usms_mappoint"
], function(ready, Map, R, RXml,   WidgetFeature, Layer, MapPoint){

  ready(function(){

var IdAddress = dojo.byId('map').getAttribute('data-usms-idaddress');
    var map = new Map("map");
    // This is New York location
    var GeoPosition = {
      longitude : -78.3983,
      latitude : -0.2074 
    };


map.addPoint = function(_latitude, _longitude, _tooltiptext){
if(Math.abs(_latitude)>0 && Math.abs(_longitude)>0){
var mapPointMaster = new MapPoint();
mapPointMaster.setTooltip(_tooltiptext);

    var descr = {
      longitude : _longitude,
      latitude : _latitude,
      widget : mapPointMaster,
      width : 20,
      height : 20
    };
    feature = new WidgetFeature(descr);

    layer = new Layer();
    layer.addFeature(feature);
    this.addLayer(layer);
}
}



var SliderZoom = dijit.byId('id_zoom');
SliderZoom.on('Change', function(v){
map.getOLMap().zoomTo(Math.round(v));
});

if(IdAddress > 0){
   R.get('fun_view_address_byid_xml.usms', {
		query: {idaddress: IdAddress},
            // Parse data from xml
            handleAs: "xml"
        }).then(
                function(response){
var d = new RXml.getFromXhr(response, 'row');
numrows = d.length;

if(numrows > 0){
GeoPosition.latitude = d.getFloat(0, "geox");
GeoPosition.longitude = d.getFloat(0, "geoy");
}

if(Math.abs(GeoPosition.latitude) > 0 || Math.abs(GeoPosition.longitude) > 0){
////////////////////////////////////
map.addPoint(GeoPosition.latitude, GeoPosition.longitude, IdAddress+' Coord: '+GeoPosition.latitude+' '+GeoPosition.longitude);

/*
var mapPointMaster = new MapPoint();
mapPointMaster.setTooltip(IdAddress+' Coord: '+GeoPosition.latitude+' '+GeoPosition.longitude);

    var descr = {
      longitude : GeoPosition.longitude,
      latitude : GeoPosition.latitude,
      widget : mapPointMaster,
      width : 20,
      height : 20
    };
    feature = new WidgetFeature(descr);

    layer = new Layer();
    layer.addFeature(feature);
    map.addLayer(layer);
*/
    map.fitTo({
      position : [ GeoPosition.longitude, GeoPosition.latitude ],
      extent : 0.01
    });

  SliderZoom.maximum = map.getOLMap().getNumZoomLevels()-1;
SliderZoom.set('value', map.getOLMap().getZoom());
map.getOLMap().zoomTo(Math.round(SliderZoom.get('value')));

}else{
map.getOLMap().zoomTo(0);
}


                },
                function(error){
                    // Display the error returned
console.log(error);
//t.emit('notify_message', {message: error}); 
map.getOLMap().zoomTo(Math.round(v));
                }
            );


}else{
    // fit to New York with 0.1 degrees extent
    map.fitTo({
      position : [ GeoPosition.longitude, GeoPosition.latitude ],
      extent : 0.1
    });
map.getOLMap().zoomTo(0);
}















  });
});

