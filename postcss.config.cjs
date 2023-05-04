/* jshint esversion: 11 */

const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const config = {
    plugins: [
        autoprefixer({
            cascade: true
        }),
        !dev &&
            cssnano({
                preset: 'advanced'
            })
    ]
};

module.exports = config;
