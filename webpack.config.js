const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");
const Refresh = require('@pmmmwh/react-refresh-webpack-plugin');
const isDev = process.env.NODE_ENV !== 'production';
const Dotenv = require('dotenv-webpack');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

const PostLoader = ({
    loader: require.resolve('postcss-loader'),
    options: {
        sourceMap: isDev,
    },
});
const cssModules = {
    // compileType: "module",
    mode: "local",
    auto: true,
    exportGlobals: true,
    localIdentName: "[path][name]__[local]--[hash:base64:5]",
    exportLocalsConvention: "camelCase",
};
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const styleLoader = isDev ? require.resolve('style-loader') : MiniCssExtractPlugin.loader;

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const EnvFile = path.resolve(__dirname , ['.env'].filter(Boolean).join('.'));
console.log(EnvFile);
require('dotenv').config({
    path: EnvFile,
});

const config = {
    mode: process.env.NODE_ENV,
    entry: {
        'app': [
            path.resolve(__dirname, "src/index.tsx"),
        ],
    },
    output: {
        path: isDev ? path.resolve(__dirname, `public/${process.env.APP_NAME}/`) : path.resolve(__dirname,`../public/${process.env.APP_NAME}/`),
        filename: `[name].[hash].js`,
        publicPath: isDev ? "/" : `/${process.env.APP_NAME}/`,
    },
    optimization: {
        minimize: true,
        minimizer: [
                new TerserPlugin({
                    extractComments : false,
                })
        ],
    },
    module: {
        unknownContextCritical : false,
        rules: [
            {
                test: /\.global\.css$/,
                use: [
                    {
                        loader: styleLoader,
                    }, {
                        loader: require.resolve('css-loader'),
                        options: {
                            sourceMap: isDev,
                            url: true,
                            import: true,
                            modules: false,
                        },
                    }, PostLoader,
                ],
            }, {
                test: /^((?!\.global).)*\.css$/,
                exclude: [
                    /[\\/]node_modules[\\/].*rc-dialog/,
                ],
                use: [
                    {
                        loader: styleLoader,
                    }, {
                        loader: require.resolve('css-loader'),
                        options: {
                            sourceMap: isDev,
                            url: true,
                            import: true,
                            modules: cssModules,
                        },
                    }, PostLoader,

                ],
            }, {
                test: /^((?!\.global).)*\.css$/,
                include: [
                    /[\\/]node_modules[\\/].*rc-dialog/,
                ],
                use: [
                    {
                        loader: styleLoader,
                    }, {
                        loader: require.resolve('css-loader'),
                        options: {
                            sourceMap: isDev,
                            url: true,
                            import: true,
                            modules: false,
                        },
                    }, PostLoader,
                ],
            }, {
                test: /\.(mp4|ogg|svg|eot|ttf|woff|woff2|jpg|png|tif)$/,
                use: {
                    loader: require.resolve('file-loader'),
                    options: {
                        outputPath: (url, resourcePath, context) => {
                            if(/\.(eot|ttf|woff|woff2)$/.test(resourcePath)){
                                return `fonts/${url}`;
                            }
                            if(/\.(jpg|png|tif)$/.test(resourcePath)){
                                return `images/${url}`;
                            }
                            return url;
                        },
                    },
                },
            }, {
                test: /\.global\.less$/,
                use: [
                    {
                        loader: styleLoader,
                    }, {
                        loader: require.resolve('css-loader'),
                        options: {
                            url: true,
                            import: true,
                            modules: false,
                        },
                    }, PostLoader, {
                        loader: require.resolve('resolve-url-loader'),
                    }, {
                        loader: require.resolve('less-loader'),
                        options: {
                            sourceMap: isDev,
                            lessOptions: {
                                javascriptEnabled: true,
                            },
                        },
                    },
                ],
            }, {
                test: /^((?!\.global).)*\.less$/,
                use: [
                    {
                        loader: styleLoader,
                    }, {
                        loader: require.resolve('css-loader'),
                        options: {
                            url: true,
                            import: true,
                            modules: cssModules,
                        },
                    }, PostLoader, {
                        loader: require.resolve('resolve-url-loader'),
                    }, {
                        loader: require.resolve('less-loader'),
                        options: {
                            sourceMap: isDev,
                            lessOptions: {
                                javascriptEnabled: true,
                            },
                        },
                    },
                ],
            }, {
                test: /\.global\.scss$/,
                use: [
                    {
                        loader: styleLoader,
                    }, {
                        loader: require.resolve('css-loader'),
                        options: {
                            url: true,
                            import: true,
                            modules: false,
                        },
                    }, PostLoader, {
                        loader: require.resolve('resolve-url-loader'),
                    }, {
                        loader: require.resolve('sass-loader'),
                        options: {
                            sourceMap: isDev,
                            sassOptions: { javascriptEnabled: true },
                        },
                    },
                ],
            }, {
                test: /^((?!\.global).)*\.scss$/,
                use: [
                    {
                        loader: styleLoader,
                    }, {
                        loader: require.resolve('css-loader'),
                        options: {
                            url: true,
                            import: true,
                            modules: cssModules,
                        },
                    }, PostLoader, {
                        loader: require.resolve('resolve-url-loader'),
                    }, {
                        loader: require.resolve('sass-loader'),
                        options: {
                            sourceMap: isDev,
                            sassOptions: { javascriptEnabled: true },
                        },
                    },
                ],
            },
            {
                test: /.(ts|tsx|js|jsx)$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'swc-loader',
                        options: {
                            "jsc": {
                                "externalHelpers": false,
                                "target": "es2015",
                                "parser": {
                                    "syntax": "typescript",
                                    "tsx": true,
                                    "dynamicImport": true,
                                    "decorators": true,
                                },
                                "transform": {
                                    "react": {
                                        "runtime": "automatic",
                                        "refresh": isDev,
                                    },
                                    "legacyDecorator": true,
                                    "decoratorMetadata": true,
                                },
                            },
                        },

                    },
                ],
            },
        ],
    },
    target: "web",
    resolve: {
        extensions: [ '.tsx', '.ts', '.jsx', '.js', '.json', '.wasm' ],
        alias: {
            '@' : path.resolve(__dirname, 'src'),
        },
    },
    devServer: {
        allowedHosts: 'all',
        hot: true,
        port : 3000,
        historyApiFallback: true,
        proxy: process.env.API_PROXY ? {
            '/api': {
                target: `${process.env.API_PROXY}`,
                pathRewrite: {
                    '^/api': '/api'
                },
                changeOrigin: true,
                // bypass: function (req, res, proxyOptions) {
                //     console.log(req,res,proxyOptions);
                // },
            },
        } : {},
    },
    plugins: [
        new AntdDayjsWebpackPlugin(),
        isDev ? new Refresh({
            overlay: {
                sockIntegration: 'whm',
            },
        }) : false,
        // new ForkTsCheckerWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
            'process.env.MODULE_MODE': `"${process.env.NODE_ENV === 'development' ?'sync' :'lazy'}"`,
            // 'process.env.MODULE_MODE': `'lazy'`,
        }),
        !isDev ? new MiniCssExtractPlugin({
            filename : '[name].[hash].css',
        }) :false,
        new Dotenv({
            path : EnvFile,
        }),
        new CleanWebpackPlugin({}),
        new HtmlWebpackPlugin(isDev ? {
            title : process.env.APP_NAME,
            filename: "index.html",
            meta : {
                'viewport' : "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
            }
        }:{
            title : process.env.APP_NAME,
            filename: "index.html",
            base : '/',
            meta : {
                'viewport' : "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
            }
        }),
    ].filter(Boolean),

};

module.exports = config;
