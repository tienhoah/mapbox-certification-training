import ReactDOM from "react-dom";
import React, { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import translink_routes from "../apis/translink_routes";
import PopupComp from "./Popup";
import useInterval from "./UseInterval";

const styles = {
  width: "100vw",
  height: "100vh",
  position: "absolute",
};

const Mapbox = ({ currentRoute }) => {
  const mapContainer = useRef(null);
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 10 }));
  const [map, setMap] = useState(null);

  const fetchBusRoute = useCallback(function (map, newRoute) {
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
            route_map: bus.RouteMap,
            route_no: bus.RouteNo,
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

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      const popupNode = document.createElement("div");
      ReactDOM.render(<PopupComp feature={e.features[0]} />, popupNode);

      popUpRef.current
        .setLngLat(coordinates)
        .setDOMContent(popupNode)
        .addTo(map);
    });

    map.on("mouseleave", "bus", function () {
      map.getCanvas().style.cursor = "";
    });
  }, []);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/nickhoang11/ckeaaht6x03hz19plpnhqkg6h",
        center: [-122.98, 49.26427],
        zoom: 11,
      });

      map.on("load", () => {
        setMap(map);
        map.addSource("satellite-map", {
          type: "raster",
          url: "mapbox://mapbox.satellite",
          tileSize: 256,
        });

        map.loadImage(
          "https://upload.wikimedia.org/wikipedia/commons/c/c4/Translinkbus.png",
          function (error, image) {
            if (error) throw error;
            map.addImage("blue-bus", image);
            map.addSource("bus", {
              type: "geojson",
              data: { type: "FeatureCollection", features: [] },
            });

            map.addLayer({
              id: "bus",
              type: "symbol",
              source: "bus",
              layout: {
                "icon-image": [
                  "case",
                  ["==", ["get", "direction"], "WEST"],
                  "bus",
                  ["==", ["get", "direction"], "SOUTH"],
                  "bus",
                  "blue-bus",
                ],
                "icon-size": [
                  "case",
                  ["==", ["get", "direction"], "WEST"],
                  1.1,
                  ["==", ["get", "direction"], "SOUTH"],
                  1.1,
                  0.4,
                ],
                "icon-allow-overlap": true,
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
          }
        );

        map.on("zoom", () => {
          if (map.getZoom() > 13) {
            map.setLayoutProperty("satellite", "visibility", "visible");
          } else {
            map.setLayoutProperty("satellite", "visibility", "none");
          }
        });

        map.on("click", "bus", function (e) {
          map.flyTo({
            center: e.features[0].geometry.coordinates,
            speed: 0.3,
          });
        });

        map.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          }),
          "bottom-right"
        );
      });
    };

    if (!map) {
      initializeMap({ setMap, mapContainer });
    } else {
      fetchBusRoute(map, currentRoute);
    }
  }, [currentRoute, fetchBusRoute, map]);

  useInterval(() => {
    if (map) fetchBusRoute(map, currentRoute);
  }, 5000);

  return <div ref={(el) => (mapContainer.current = el)} style={styles} />;
};

export default Mapbox;
