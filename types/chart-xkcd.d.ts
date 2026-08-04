declare module 'chart.xkcd' {
  export interface ChartDataset {
    label?: string;
    data: number[];
  }

  export interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
  }

  export interface ChartOptions {
    yTickCount?: number;
    xTickCount?: number;
    innerRadius?: number;
    legendPosition?: number;
    dataColors?: string[];
    fontFamily?: string;
    unxkcdify?: boolean;
    showLine?: boolean;
    backgroundColor?: string;
    strokeColor?: string;
  }

  export interface ChartConfig {
    title?: string;
    xLabel?: string;
    yLabel?: string;
    data: ChartData;
    options?: ChartOptions;
  }

  type ChartConstructor = new (svg: SVGSVGElement, config: ChartConfig) => unknown;

  export interface ChartXkcd {
    config: {
      positionType: {
        upLeft: number;
        upRight: number;
        downLeft: number;
        downRight: number;
      };
    };
    Bar: ChartConstructor;
    StackedBar: ChartConstructor;
    Pie: ChartConstructor;
    Line: ChartConstructor;
    Combined: ChartConstructor;
    XY: ChartConstructor;
    Radar: ChartConstructor;
  }

  const chartXkcd: ChartXkcd;
  export default chartXkcd;
}
