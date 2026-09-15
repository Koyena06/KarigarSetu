// Metro resolves image imports to asset module ids usable as <Image source>.
declare module '*.png' {
  const value: number;
  export default value;
}
declare module '*.jpg' {
  const value: number;
  export default value;
}
