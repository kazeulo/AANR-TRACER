export interface ABHRegion {
  region: string;
  university?: string;
  email?: string;
}

// iptbm
export interface Institution {
  name: string;
  email?: string;
}

export interface IPTBMRegion {
  region: string;
  universities: Institution[];
}