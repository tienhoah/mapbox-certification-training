import React, { Component } from "react";

import Mapbox from "./Mapbox";
import SelectControl from "./SelectControl";
import translink_routes from "../apis/translink_routes";

class Main extends Component {
  state = { currentRoute: "", availableRoutes: ["99", "145"], allRoutes: [] };

  async componentDidMount() {
    const allBuses = await translink_routes.get("", {
      params: { apikey: process.env.REACT_APP_TRANSLINK_API_KEY },
    });
    const activeBuses = allBuses
      ? allBuses.data.map((bus) => {
          return bus.RouteNo;
        })
      : [];

    const uniqBuses = new Set(activeBuses);
    const uniqBusLabels = [...uniqBuses].map((bus) => {
      return { label: bus };
    });

    this.setState({ allRoutes: uniqBusLabels });
  }

  updateBusRoute = (route) => {
    this.setState({ currentRoute: route });
  };

  render() {
    return (
      <>
        <SelectControl
          currentRoute={this.state.currentRoute}
          allRoutes={this.state.allRoutes}
          updateBusRoute={this.updateBusRoute}
        />
        <Mapbox currentRoute={this.state.currentRoute} />
      </>
    );
  }
}

export default Main;
