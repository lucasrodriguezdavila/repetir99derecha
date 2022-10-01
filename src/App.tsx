import { useEffect, useState } from "react";
import { SatRec, twoline2satrec } from "satellite.js";
import Globo from "./components/Globo/Globo";
import { getSatelliteByID } from "./services/SatelliteService";

function App() {
  const satelliteId = 25544;

  return (
    <div className="App">
      <Globo satelliteId={satelliteId} />
    </div>
  );
}

export default App;
