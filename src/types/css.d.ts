// Tells TypeScript that .css files are valid imports (used by Expo web bundler)
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
