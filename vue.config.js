const {defineConfig} = require('@vue/cli-service')
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

module.exports = defineConfig({
    transpileDependencies: true,
    chainWebpack: (config) => {
        // Get the country from the npm argument (passed with `--country=FR`)
        const country = process.env.npm_config_country || 'LK';

        // Determine the path to the country-specific `.env` file
        const envFilePath = path.resolve(__dirname, `.env.${country}`);

        // Load the country-specific .env file if it exists
        if (fs.existsSync(envFilePath)) {
            const envConfig = dotenv.config({path: envFilePath}).parsed;

            // Define the environment variables for Webpack
            for (const key in envConfig) {
                config.plugin('define').tap((args) => {
                    args[0][`process.env.${key}`] = JSON.stringify(envConfig[key]);
                    return args;
                });
            }
        } else {
            console.warn(`No environment file found for country: ${country}. Using default settings.`);
        }

        config.resolve.alias.set('vue', '@vue/compat')

        config.module
            .rule('vue')
            .use('vue-loader')
            .tap((options) => {
                return {
                    ...options,
                    compilerOptions: {
                        compatConfig: {
                            MODE: 2
                        }
                    }
                }
            })
    }
})
