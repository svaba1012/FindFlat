import { WebQuery, WebSellableItem } from "../WebScrapable";

export type WebFlatItem = WebSellableItem & {
  location: string | null | undefined;
  address: string | null | undefined;
  surface: string | null | undefined;
  surfaceUnit: string | null | undefined;
  numberOfRooms: string | null | undefined;
  floor: string | null | undefined;
  maxFloor: string | null | undefined;
};

export type WebFlatQuery = WebQuery & {
  surface_min?: number;
  surface_max?: number;
  surfaceUnit?: string;
  numberOfRoomsMin?: number;
  numberOfRoomsMax?: number;
  sellOrRent?: string;
  sortDescending?: boolean;
  sortCriteria?: string;
  city?: string;
  location?: any;
};
