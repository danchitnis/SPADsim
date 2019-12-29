// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';


export default {
    input: './dist/main.js',
    output: {
      file: './dist/bundle.js',
      format: 'iife'
    },
    plugins: [
      resolve(),
      commonjs({
        namedExports: {
          // left-hand side can be an absolute path, a path
          // relative to the current directory, or the name
          // of a module in node_modules
          'nouislider': [ 'noUiSlider' ]
        }
      })
    ]
  };