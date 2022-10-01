import React, { createContext, useContext } from "react";
import { Satellite } from "../interfaces/Satellite";

interface ISatelliteContext {
  satellites: Satellite[];
  setSatellites: React.Dispatch<React.SetStateAction<Satellite[]>>;
}

export const SatelliteContext = createContext<ISatelliteContext>(null!);

export const useSatellite = (): ISatelliteContext =>
  useContext<ISatelliteContext>(SatelliteContext);

export const SatelliteProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [satellites, setSatellites] = React.useState<Satellite[]>([]);

  return (
    <SatelliteContext.Provider
      value={{
        satellites,
        setSatellites,
      }}
    >
      {children}
    </SatelliteContext.Provider>
  );
};
