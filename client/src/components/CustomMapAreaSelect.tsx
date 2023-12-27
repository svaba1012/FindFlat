import React, { useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

import CustomMapTools from "./CustomMapTools";

function ChangeView({ center, zoom, shouldMapRecenter }) {
  console.log("RERENDERING MAP");
  if (!shouldMapRecenter) {
    return null;
  }
  const map = useMap();
  let centerObj = { lat: center[0], lng: center[1] };
  map.setView(centerObj, zoom);
  return null;
}

function CustomMapAreaSelect({
  center,
  setAreaCoords,
  areaCoords,
  shouldMapRecenter,
  setShouldMapRecenter,
}) {
  return (
    <MapContainer
      style={{ height: 400 }}
      center={center}
      zoom={13}
      scrollWheelZoom={false}
    >
      <ChangeView
        center={center}
        zoom={13}
        shouldMapRecenter={shouldMapRecenter}
      />
      <CustomMapTools
        setAreaCoords={setAreaCoords}
        areaCoords={areaCoords}
        setShouldMapRecenter={setShouldMapRecenter}
      />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}

export default CustomMapAreaSelect;
