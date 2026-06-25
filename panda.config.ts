import { defineConfig, defineGlobalStyles } from "@pandacss/dev";

const globalCss = defineGlobalStyles({
  html: {
    colorScheme: "light dark",
  },
  "html, body": {
    fontFamily: "sans-serif",
    transition: "background-color 0.2s ease, color 0.2s ease",
    "&[data-theme='light']": {
      backgroundColor: "white",
      color: "gray.900",
    },
    "&[data-theme='dark']": {
      backgroundColor: "gray.900",
      color: "gray.100",
    },
  },
  a: {
    "[data-theme='light'] &": {
      color: "blue.600",
    },
    "[data-theme='dark'] &": {
      color: "blue.400",
    },
  },
  "a:hover": {
    "[data-theme='light'] &": {
      color: "blue.700",
    },
    "[data-theme='dark'] &": {
      color: "blue.300",
    },
  },
});

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{js,jsx,ts,tsx,astro}", "./pages/**/*.{js,jsx,ts,tsx,astro}"],
  exclude: [],
  shorthands: false,
  strictPropertyValues: true,

  theme: {
    extend: {
      tokens: {},
      semanticTokens: {
        colors: {
          background: {
            value: {
              _light: "white",
              _dark: "gray.900",
            },
          },
          foreground: {
            value: {
              _light: "gray.900",
              _dark: "gray.100",
            },
          },
          card: {
            value: {
              _light: "white",
              _dark: "gray.800",
            },
          },
          cardForeground: {
            value: {
              _light: "gray.900",
              _dark: "gray.100",
            },
          },
          primary: {
            value: {
              _light: "blue.600",
              _dark: "blue.400",
            },
          },
          primaryForeground: {
            value: {
              _light: "white",
              _dark: "gray.900",
            },
          },
          muted: {
            value: {
              _light: "gray.100",
              _dark: "gray.800",
            },
          },
          mutedForeground: {
            value: {
              _light: "gray.600",
              _dark: "gray.400",
            },
          },
          border: {
            value: {
              _light: "gray.200",
              _dark: "gray.700",
            },
          },
        },
      },
    },
  },
  conditions: {
    extend: {
      light: "&[data-theme='light'] &",
      dark: "&[data-theme='dark'] &",
    },
  },
  outdir: "styled-system",
  globalCss,
});
