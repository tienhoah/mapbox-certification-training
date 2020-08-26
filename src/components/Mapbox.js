import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import translink_routes from "../apis/translink_routes";
// import Marker from "./Marker";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const Mapbox = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/nickhoang11/ckeaaht6x03hz19plpnhqkg6h",
      center: [-123.12, 49.26427],
      zoom: 12,
    });

    map.on("load", () => {
      window.setInterval(() => {
        translink_routes.get().then((res) => {
          const busLocation = {
            type: "FeatureCollection",
            features: [],
          };
          res.data.forEach((bus) => {
            const busLatLng = {
              type: "Point",
              coordinates: [bus.Longitude, bus.Latitude],
            };
            const markerPoint = { type: "Feature", geometry: busLatLng };

            busLocation.features.push(markerPoint);
          });

          if (map.getSource("bus99") !== undefined) {
            map.getSource("bus99").setData(busLocation);
          }
        });
      }, 3000);

      map.addSource("bus99", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.addLayer({
        id: "bus",
        type: "symbol",
        source: "bus99",
        layout: {
          "icon-image": "bus",
        },
      });
    });

    return () => map.remove();
  }, []);

  return <div className="map-container" ref={mapContainerRef} />;
};

export default Mapbox;
