import { TranslateResult } from 'vue-i18n'
import { Interaction } from '../rmrk/service/scheme'

export type Column = {
  field: keyof RowSeries;
  label: string | TranslateResult;
  width?: number;
  numeric?: boolean;
  centered?: boolean;
};

type VolumeType = number | bigint;

export type RowSeries = {
  id: string;
  unique: number;
  image: any;
  metadata: string;
  sold: number;
  total: number;
  volume: VolumeType;
  weeklyVolume: VolumeType;
  monthlyVolume: VolumeType;
  averagePrice: number;
  floorPrice: number;
  rank: number;
  uniqueCollectors: number;
  name: string;
};

export type SimpleSeriesNFT = {
  issuer: string;
  currentOwner: string;
  metadata: string;
  price: number;
  events: Interaction[];
};
