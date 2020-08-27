import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import translink_routes from "../apis/translink_routes";
import _ from "lodash";
import useInterval from "./UseInterval";

const styles = {
  width: "100vw",
  height: "100vh",
  position: "absolute",
};

const createPopup = function (feature) {
  const { vehicle_no, destination, record_time } = feature.properties;
  return !_.isEmpty(feature)
    ? "<div><p><strong>Vehicle Number: </strong><span>" +
        vehicle_no +
        "</span></p><p>Destination: <span>" +
        destination +
        "</span></p><p>Record Time: <span>" +
        record_time +
        "</span></p></div>"
    : "<p>No content</p>";
};

const Mapbox = ({ currentRoute }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);

  const fetchBusRoute = (map, newRoute) => {
    const popUp = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    translink_routes
      .get("", {
        params: {
          apikey: process.env.REACT_APP_TRANSLINK_API_KEY,
          routeNo: newRoute,
        },
      })
      .then((res) => {
        const busLocation = {
          type: "FeatureCollection",
          features: [],
        };
        res.data.forEach((bus) => {
          const busCoordinates = [bus.Longitude, bus.Latitude];
          const busGeoData = {
            vehicle_no: bus.VehicleNo,
            record_time: bus.RecordedTime,
            direction: bus.Direction,
            destination: bus.Destination,
            coordinates: busCoordinates,
          };
          const busLatLng = {
            type: "Point",
            coordinates: busCoordinates,
          };
          const markerPoint = {
            type: "Feature",
            geometry: busLatLng,
            properties: busGeoData,
          };

          busLocation.features.push(markerPoint);
        });

        if (map.getSource("bus") !== undefined) {
          map.getSource("bus").setData(busLocation);
        }
      });

    map.on("mouseenter", "bus", function (e) {
      map.getCanvas().style.cursor = "pointer";
      const coordinates = e.features[0].geometry.coordinates.slice();
      const feature = createPopup(e.features[0]);

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      popUp.setLngLat(coordinates).setHTML(feature).addTo(map);
    });

    map.on("mouseleave", "bus", function () {
      map.getCanvas().style.cursor = "";
      popUp.remove();
    });
  };

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/nickhoang11/ckeaaht6x03hz19plpnhqkg6h",
        center: [-123.12, 49.26427],
        zoom: 12,
      });

      map.on("load", () => {
        setMap(map);
        map.addSource("satellite-map", {
          type: "raster",
          url: "mapbox://mapbox.satellite",
          tileSize: 256,
        });

        map.addSource("bus", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        });

        map.addLayer({
          id: "bus",
          type: "symbol",
          source: "bus",
          layout: {
            "icon-image": "bus",
            "icon-allow-overlap": true,
          },
          paint: {
            "icon-color": "#00ff00",
          },
        });

        map.addLayer(
          {
            id: "satellite",
            source: "satellite-map",
            type: "raster",
            layout: {
              visibility: "none",
            },
          },
          "bus"
        );

        map.on("zoom", () => {
          if (map.getZoom() > 13) {
            map.setLayoutProperty("satellite", "visibility", "visible");
          } else {
            map.setLayoutProperty("satellite", "visibility", "none");
          }
        });
      });
    };

    if (!map) {
      initializeMap({ setMap, mapContainer });
    } else {
      fetchBusRoute(map, currentRoute);
    }
    
  }, [currentRoute, map]);

  useInterval(() => {
    if (map) fetchBusRoute(map, currentRoute);
  }, 5000);

  return <div ref={(el) => (mapContainer.current = el)} style={styles} />;
};

export default Mapbox;
