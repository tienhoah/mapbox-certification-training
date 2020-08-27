import React, { Component } from "react";

import Mapbox from "./Mapbox";
import RadioControl from "./RadioControl";

class Main extends Component {
  state = { currentRoute: "99", availableRoutes: ["99", "145"] };

  updateBusRoute = (route) => {
    this.setState({ currentRoute: route });
  };

  render() {
    return (
      <>
        <Mapbox currentRoute={this.state.currentRoute} />
        <RadioControl
          currentRoute={this.state.currentRoute}
          availableRoutes={this.state.availableRoutes}
          updateBusRoute={this.updateBusRoute}
        />
      </>
    );
  }
}

export default Main;
