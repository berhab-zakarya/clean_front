// types/jeelizvtowidget.d.ts

declare module 'jeelizvtowidget' {
    export const JeelizVTOWidget: {
      init: (params: {
        canvas: HTMLCanvasElement | null;
        path: string;
        sku: string;
        onLoad?: () => void;
        onError?: (err: string) => void;
      }) => void;
    };

    export function init(arg0: { canvas: HTMLCanvasElement | null; path: string; sku: string; onLoad: () => void; onError: (err: string) => void; }) {
        throw new Error('Function not implemented.');
    }
  }
  