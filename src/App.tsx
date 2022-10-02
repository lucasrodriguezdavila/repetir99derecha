import Globo from "./components/RealTimeTrack/RealTimeTrack";
import { IssPathGlobe } from "./components/IssPathGlobe/IssPathGlobe";
import { MainNavbar } from "./components/MainNavbar";
import { useEffect, useState } from "react";
import { SatRec, twoline2satrec } from "satellite.js";
import { SatelliteTLEResponse } from "./services/types/satelliteTleResponse";
import { getSatelliteByID } from "./services/SatelliteService";

function App() {
  const satelliteId = 25544;

  const [satRec, setSatRec] = useState<SatRec>();
  useEffect(() => {
    getSatelliteByID(satelliteId).then((sat) => {
      const data = sat as unknown as SatelliteTLEResponse;
      if (data.line1) {
        const satRec = twoline2satrec(data.line1, data.line2);
        setSatRec(satRec);
      }
    });
  }, [satelliteId]);

  return (
    <div className="App">
      <MainNavbar />
      {satRec && <Globo satelliteId={satelliteId} satRec={satRec} />}
    </div>
  );
}

export default App;
