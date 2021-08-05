import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/walax.cjs.js',
            format: 'cjs'
        },
        {
            file: 'dist/walax.min.js',
            format: 'iife',
            name: 'walax',
            plugins: [terser()]
        },
        {
            file: 'dist/walax.umd.js',
            format: 'umd',
            name: 'walax'
        }
    ],
    plugins: [
        json(),
        resolve(),
        commonjs(),
        babel({ babelHelpers: 'bundled' })
    ]
}