import React, { useState } from "react";
import L from "leaflet";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

const CustomMapTools = ({
  setAreaCoords,
  areaCoords,
  setShouldMapRecenter,
}) => {
  const _onEdited = (e) => {
    let numEdited = 0;
    e.layers.eachLayer((layer) => {
      numEdited += 1;
    });
    console.log(`_onEdited: edited ${numEdited} layers`, e);

    // this._onChange();
  };

  let polygon: null | L.Polygon = null;

  const _onCreated = (e) => {
    setShouldMapRecenter(false);
    let type = e.layerType;
    let layer = e.layer;
    if (type === "marker") {
      // Do marker specific actions
      console.log("_onCreated: marker created", e);
    } else {
      console.log("_onCreated: something else created:", type, e);
    }

    if (type === "polygon") {
      if (polygon) {
        polygon.remove();
      }
      polygon = layer as L.Polygon;

      setAreaCoords(layer.getLatLngs()[0]);
    }

    console.log("Geojson", layer.toGeoJSON());
    console.log("coords", layer.getLatLngs());

    // Do whatever else you need to. (save to db; etc)

    // this._onChange();
  };

  const _onDeleted = (e) => {
    let numDeleted = 0;
    e.layers.eachLayer((layer) => {
      numDeleted += 1;
    });
    console.log(`onDeleted: removed ${numDeleted} layers`, e);
    setAreaCoords([]);
    polygon = null;
    // this._onChange();
  };

  const _onMounted = (drawControl) => {
    console.log("_onMounted", drawControl);
  };

  const _onEditStart = (e) => {
    console.log("_onEditStart", e);
  };

  const _onEditStop = (e) => {
    console.log("_onEditStop", e);
  };

  const _onDeleteStart = (e) => {
    console.log("_onDeleteStart", e);
  };

  const _onDeleteStop = (e) => {
    console.log("_onDeleteStop", e);
  };

  const _onDrawStart = (e) => {
    console.log("_onDrawStart", e);
  };

  /*onEdited	function	hook to leaflet-draw's draw:edited event
onCreated	function	hook to leaflet-draw's draw:created event
onDeleted	function	hook to leaflet-draw's draw:deleted event
onMounted	function	hook to leaflet-draw's draw:mounted event
onEditStart	function	hook to leaflet-draw's draw:editstart event
onEditStop	function	hook to leaflet-draw's draw:editstop event
onDeleteStart	function	hook to leaflet-draw's draw:deletestart event
onDeleteStop	function	hook to leaflet-draw's draw:deletestop event
onDrawStart	function	hook to leaflet-draw's draw:drawstart event
onDrawStop	function	hook to leaflet-draw's draw:drawstop event
onDrawVertex	function	hook to leaflet-draw's draw:drawvertex event
onEditMove	function	hook to leaflet-draw's draw:editmove event
onEditResize	function	hook to leaflet-draw's draw:editresize event
onEditVertex	function	hook to leaflet-draw's draw:editvertex event*/
  return (
    <FeatureGroup>
      <EditControl
        onDrawStart={_onDrawStart}
        position="topright"
        onEdited={_onEdited}
        onCreated={_onCreated}
        onDeleted={_onDeleted}
        draw={{
          polyline: false,
          rectangle: false,
          circlemarker: false,
          circle: false,
          marker: false,
          polygon: {
            icon: new L.DivIcon({
              iconSize: new L.Point(12, 12),
              className: "leaflet-div-icon leaflet-editing-icon",
            }),
            shapeOptions: {
              stroke: true,
              color: "black",
              weight: 4,
              opacity: 0.5,
              fill: true,
              //   clickable: true,
            },
            repeatMode: true,
            guidelineDistance: 10,
          },
        }}
        edit={{ edit: false }}
      />
    </FeatureGroup>
  );
};

export default CustomMapTools;
