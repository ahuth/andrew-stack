import {init, parse} from 'es-module-lexer';
import {type Plugin, defineConfig} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    nullLoader('.server'),
    nullLoader('@remix-run/node'),
  ],
});

/**
 * Prevent Vite from including content in certain modules. Especially server-side code, which we
 * don't want in Storybook builds.
 */
function nullLoader(pattern: string): Plugin {
  return {
    name: 'null-loader',
    enforce: 'pre',
    async transform(code, id) {
      if (id.includes(pattern)) {
        await init;
        // Find exports
        const [, exports] = parse(code);
        // Create a module that is empty other than exporting the same names it had before.
        return {
          code:
            'export default {};\n' +
            exports
              // Don't include the "default" export, which is already accounted for above.
              .filter((exp) => exp.n !== 'default')
              // Null value for each exported name.
              .map((exp) => `export const ${exp.n} = null;`)
              .join('\n'),
          // Preserve existing sourcemaps.
          map: null,
          // Automagically create named exports for all properties of the default export.
          syntheticNamedExports: true,
        };
      }
    },
  };
}
