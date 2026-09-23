// Official Singapore LTA DataMall Bus Stops Dataset
// Sourced from Land Transport Authority (LTA) Singapore DataMall
import stopsJson from './ltaBusStopsData.json';

export interface LTABusStop {
  code: string;
  name: string;
  road: string;
  services: string[];
}

export const LTA_OFFICIAL_BUS_STOPS: LTABusStop[] = stopsJson as LTABusStop[];

export function searchLTABusStops(query: string): LTABusStop[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return LTA_OFFICIAL_BUS_STOPS.filter((stop) => {
    return (
      stop.code.includes(q) ||
      stop.name.toLowerCase().includes(q) ||
      stop.road.toLowerCase().includes(q)
    );
  });
}
