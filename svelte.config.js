/* jshint esversion: 11 */

// Imports
import preprocess from 'svelte-preprocess';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Adapters
import vercelAdapter from '@sveltejs/adapter-vercel';

// Custom require function as replacement for the require from the commonJS in ES Module

// Custom __dirname as replacement for the __dirname from the commonJS in ES Module
const __dirname = dirname(fileURLToPath(import.meta.url)); // jshint ignore:line

const options = JSON.stringify(process.env.OPTIONS || '{}');

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [
        preprocess({
            postcss: true,
            preserve: ['ld+json', 'module'],
            typescript: true,
            scss: {
                prependData: `@use "src/mixins.scss" as *;`
            }
        })
    ],

    kit: {
        adapter: vercelAdapter(options),
        target: '#root',
        ssr: true,
        prerender: {
            crawl: true,
            enabled: true,
            onError: 'fail',
            pages: ['*']
        },
        vite: () => ({
            resolve: {
                alias: {
                    $store: resolve(__dirname, './src/lib/store'),
                    $game: resolve(__dirname, './src/lib/game'),
                    $ui: resolve(__dirname, './src/lib/ui'),
                    $utils: resolve(__dirname, './src/lib/utils'),
                    $assets: resolve(__dirname, './src/lib/assets'),
                    $types: resolve(__dirname, './src/lib/types')
                }
            },
            envPrefix: ['VITE_', 'PROTO_MASS_'],
            plugins: [],
            ssr: {
                external: ['@xstate/svelte']
            },
            css: {
                preprocessorOptions: {
                    postcss: true
                }
            }
        })
    }
};

export default config;
