import Globo from "./components/RealTimeTrack/RealTimeTrack";
import { IssPathGlobe } from "./components/IssPathGlobe/IssPathGlobe";
import { MainNavbar } from "./components/MainNavbar";
import { useEffect, useState } from "react";
import { SatRec, twoline2satrec } from "satellite.js";
import { SatelliteTLEResponse } from "./services/types/satelliteTleResponse";
import { getSatelliteByID } from "./services/SatelliteService";
import Range from "./components/Range";
import { Live } from "./components/Live";

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
      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            display: "inline-block",
            border: "1px solid #CCC",
            borderRadius: "6px",
            WebkitBorderRadius: "6px",
            //@ts-ignore
            "o-border-radius": "6px",
            position: "relative",
            overflow: "hidden",
            width: "310px",
            height: "450px",
          }}
        >
          <iframe
            title="ISS Oberservation"
            src="https://spotthestation.nasa.gov/widget/widget2.cfm?theme=2"
            width={310}
            height={450}
            frameBorder={0}
          />
        </div>
      </div>

      <Range />
      <MainNavbar />
      <Live />
      {satRec && <Globo satelliteId={satelliteId} satRec={satRec} />}
    </div>
  );
}

export default App;
