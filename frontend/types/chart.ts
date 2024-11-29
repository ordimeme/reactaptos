import { Time } from 'lightweight-charts';
import { ChartTheme } from './market';

export interface ChartData {
  time: Time;
  value: number;
}

export interface ChartOptions {
  theme: ChartTheme;
  interval: string;
  showVolume?: boolean;
  showGrid?: boolean;
  height?: number;
} 