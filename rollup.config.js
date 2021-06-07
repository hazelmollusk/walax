import json from '@rollup/plugin-json';
import {terser} from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/walax.js',
            format: 'cjs'
        },
        {
            file: 'dist/walax.min.js',
            format: 'iife',
            name: 'version',
            plugins: [terser()]
        }
    ],
    plugins: [ 
        json(),
        resolve(),
        commonjs(),
        babel({ babelHelpers: 'bundled' }) 
    ]
  };