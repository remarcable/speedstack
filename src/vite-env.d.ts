/// <reference types="vite/client" />

// CSS Module types
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
