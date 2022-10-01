type SatelliteTLEResponse = {
  satelliteId: number;
  name: string;
  date: string;
  line1: string;
  line2: string;
};

type ErrorMessage = {
  code: string;
  message: string;
};

export type { SatelliteTLEResponse, ErrorMessage };
