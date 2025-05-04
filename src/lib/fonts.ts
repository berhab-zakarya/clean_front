// lib/fonts.ts
import { Poppins } from 'next/font/google';
import localFont from 'next/font/local';

export const poppins = Poppins({
    weight:"500",

  });
export const revolution = localFont({
  src: '../../public/assets/fonts/revolution.ttf',
  display: 'swap',
  variable: '--font-revolution',
});

export const black = localFont({
  src: '../../public/assets/fonts/static/black.ttf',
  display: 'swap',
  variable: '--font-black',
});

export const bold = localFont({
  src: '../../public/assets/fonts/static/bold.ttf',
  display: 'swap',
  variable: '--font-bold',
});

export const extrabold = localFont({
  src: '../../public/assets/fonts/static/extrabold.ttf',
  display: 'swap',
  variable: '--font-extrabold',
});

export const extralight = localFont({
  src: '../../public/assets/fonts/static/extralight.ttf',
  display: 'swap',
  variable: '--font-extralight',
});

export const light = localFont({
  src: '../../public/assets/fonts/static/light.ttf',
  display: 'swap',
  variable: '--font-light',
});

export const medium = localFont({
  src: '../../public/assets/fonts/static/medium.ttf',
  display: 'swap',
  variable: '--font-medium',
});

export const regular = localFont({
  src: '../../public/assets/fonts/static/regular.ttf',
  display: 'swap',
  variable: '--font-regular',
});

export const semibold = localFont({
  src: '../../public/assets/fonts/static/semibold.ttf',
  display: 'swap',
  variable: '--font-semibold',
});

export const thin = localFont({
  src: '../../public/assets/fonts/static/thin.ttf',
  display: 'swap',
  variable: '--font-thin',
});

export const variable = localFont({
  src: '../../public/assets/fonts/variablefont_wght.ttf',
  display: 'swap',
  variable: '--font-variable',
});

export const fontFamily = `font-[family-name:var(--font-outfit)] text-sm`