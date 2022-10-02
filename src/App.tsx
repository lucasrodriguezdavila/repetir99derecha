import Globo from "./components/RealTimeTrack/RealTimeTrack";
import { MainNavbar } from "./components/MainNavbar";
import { useEffect, useState } from "react";
import { SatRec, twoline2satrec } from "satellite.js";
import { SatelliteTLEResponse } from "./services/types/satelliteTleResponse";
import { getSatelliteByID } from "./services/SatelliteService";
import Range from "./components/Range";
import { useSatellite } from "./context/SatelliteContext";

function App() {
  const satelliteId = 25544;

  const [satRec, setSatRec] = useState<SatRec>();
  const { isISSTracked } = useSatellite();

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
      <Range isHidden={isISSTracked} />
      {satRec && <Globo satelliteId={satelliteId} satRec={satRec} />}
    </div>
  );
}

export default App;
