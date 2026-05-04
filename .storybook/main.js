const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const srcDir = path.resolve(rootDir, "src");
const globalLess = path.resolve(srcDir, "assets/css/var.less");
const csslabBaseLess = path.resolve(rootDir, "node_modules/csslab/base.less");
const storybookVarsLess = path.resolve(srcDir, "storybook/storybook-vars.less");

module.exports = {
    framework: {
        name: "@storybook/vue3-webpack5",
        options: {},
    },
    stories: ["../stories/components/*.stories.js", "../stories/exports/*.stories.js"],
    staticDirs: ["../public"],
    addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions"],
    docs: {
        autodocs: "tag",
    },
    webpackFinal: async (config) => {
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            "@": srcDir,
            "@src": srcDir,
        };
        config.resolve.extensions = Array.from(new Set([...(config.resolve.extensions || []), ".vue", ".js", ".json"]));

        config.module.rules.push(
            {
                test: /\.svg$/i,
                resourceQuery: /inline/,
                use: [
                    {
                        loader: require.resolve("vue-svg-inline-loader"),
                    },
                ],
            },
            {
                test: /\.less$/i,
                use: [
                    require.resolve("style-loader"),
                    {
                        loader: require.resolve("css-loader"),
                        options: {
                            importLoaders: 2,
                        },
                    },
                    require.resolve("postcss-loader"),
                    {
                        loader: require.resolve("less-loader"),
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                            },
                        },
                    },
                    {
                        loader: require.resolve("style-resources-loader"),
                        options: {
                            patterns: [csslabBaseLess, globalLess, storybookVarsLess],
                        },
                    },
                ],
            }
        );

        return config;
    },
};
