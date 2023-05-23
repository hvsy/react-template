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
    localIdentName: "[path][name]__[local]--[contenthash:base64:5]",
    exportLocalsConvention: "camelCase",
};
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const styleLoader = isDev ? require.resolve('style-loader') : MiniCssExtractPlugin.loader;

const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const EnvFile = path.resolve(__dirname, ['.env'].filter(Boolean).join('.'));
console.log(EnvFile);
require('dotenv').config({
    path: EnvFile,
});

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    context: path.resolve(__dirname),
    devtool: isDev ? 'eval-cheap-source-map' : false,
    mode: process.env.NODE_ENV,
    cache: {type: 'filesystem',},
    entry: {
        'app': [
            path.resolve(__dirname, "src/index.tsx"),
        ],
    },
    output: {
        path: isDev ? path.resolve(__dirname, `public/${process.env.APP_NAME}/`) : path.resolve(__dirname, `../public/${process.env.APP_NAME}/`),
        filename: `[name].[contenthash].js`,
        publicPath: isDev ? "/" : `/${process.env.APP_NAME}/`,
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            })
        ],
        sideEffects: true,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'async',
            minSize: 20000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                antv: {
                    test: /[\\/]node_modules\/@antv[\\/]/,
                    name: 'antv',
                    chunks: 'all',
                    reuseExistingChunk: true,
                },
                antd: {
                    test: /[\\/]node_modules\/antd[\\/]/,
                    name: 'antd',
                    // chunks: 'all',
                    reuseExistingChunk: true,
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    // chunks: 'all',
                    reuseExistingChunk: true,
                    priority: -20,
                },
                // ui : {
                //     test : '[\\\\/]ui[\\\\/]',
                //     name : 'ui',
                //     chunks  : 'all',
                // }
            },
        },
    },
    module: {
        unknownContextCritical: false,
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
            },

            {
                test: /^((?!\.global).)*\.css$/, //不包含global.css
                include: [
                    /[\\/]node_modules[\\/].*antd/,
                    /[\\/]node_modules[\\/].*ant-design-pro/,
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
                test: /^((?!\.global).)*\.css$/, //不包含global.css
                exclude: [
                    /[\\/]node_modules[\\/].*antd/,
                    /[\\/]node_modules[\\/].*ant-design-pro/,
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
                test: /\.(mp4|ogg|svg|eot|ttf|woff|woff2|jpg|png|tif)$/,
                use: {
                    loader: require.resolve('file-loader'),
                    options: {
                        outputPath: (url, resourcePath, context) => {
                            if (/\.(eot|ttf|woff|woff2)$/.test(resourcePath)) {
                                return `fonts/${url}`;
                            }
                            if (/\.(jpg|png|tif)$/.test(resourcePath)) {
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
                            sassOptions: {javascriptEnabled: true},
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
                            sassOptions: {javascriptEnabled: true},
                        },
                    },
                ],
            },
            // {
            //     test: /.(ts|tsx)$/,
            //     exclude: /node_modules/,
            //     use: [{
            //         loader: 'ts-loader',
            //         options: {
            //             transpileOnly: true,
            //         },
            //     }]
            // },
            {
                test: /.(ts|tsx|js|jsx)$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            "presets": [
                                "@babel/preset-env",
                                ["@babel/preset-react",{
                                    runtime: 'automatic',
                                }],
                                "@babel/preset-typescript"
                            ],
                            "plugins": [
                                isDev ? require.resolve('react-refresh/babel') : false,
                                // [
                                //     "import",
                                //     {
                                //         "libraryName": "antd",
                                //         "libraryDirectory": "es",
                                //         "style": false
                                //     },
                                //     'antd',
                                // ],
                                [
                                    "import",
                                    {
                                        "libraryName": "@ant-design/plots",
                                        "libraryDirectory": "es",
                                        "style": false
                                    },
                                    'plots',
                                ],
                                [
                                    "import",
                                    {
                                        "libraryName": "@ant-design/graphs",
                                        "libraryDirectory": "es",
                                        "style": false
                                    },
                                    'graphs',
                                ],
                                [
                                    "import",
                                    {
                                        "libraryName": "@ant-design/maps",
                                        "libraryDirectory": "es",
                                        "style": false
                                    },
                                    'maps',
                                ]
                            ].filter(Boolean)
                        },


                    }
                    // {
                    //     loader: 'swc-loader',
                    //     options: {
                    //         "jsc": {
                    //             experimental: {
                    //                 plugins: [
                    //                     [
                    //                         "@swc/plugin-transform-imports",
                    //                         {
                    //                             "antd" : {
                    //                                 "transform" : "antd/es/{{member}}"
                    //                             },
                    //                             "@ant-design/plots" : {
                    //                                 "transform" : "@ant-design/plots/es/{{member}}"
                    //                             },
                    //                             "@ant-design/graphs" : {
                    //                                 "transform" : "@ant-design/graphs/es/{{member}}"
                    //                             },
                    //                             "@ant-design/maps" : {
                    //                                 "transform" : "@ant-design/maps/es/{{member}}"
                    //                             },
                    //                         }
                    //                     ]
                    //                 ]
                    //             },
                    //             "externalHelpers": false,
                    //             "target": "es2015",
                    //             "parser": {
                    //                 "syntax": "typescript",
                    //                 "tsx": true,
                    //                 "dynamicImport": true,
                    //                 "decorators": true,
                    //             },
                    //             "transform": {
                    //                 "react": {
                    //                     "runtime": "automatic",
                    //                     "refresh": isDev,
                    //                 },
                    //                 "legacyDecorator": true,
                    //                 "decoratorMetadata": true,
                    //             },
                    //         },
                    //     },
                    //
                    // },
                ],
            },
        ],
    },
    target: "web",
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.wasm'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@ui': path.resolve(__dirname, 'src/ui'),
            '@lib': path.resolve(__dirname, 'src/lib'),
            '@containers': path.resolve(__dirname, 'src/containers'),
        },
    },
    devServer: {
        allowedHosts: 'all',
        host: '0.0.0.0',
        hot: true,
        port: 3000,
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
            '/storage': {
                target: `${process.env.API_PROXY}`,
                pathRewrite: {
                    '^/storage': '/storage'
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
        // new BundleAnalyzerPlugin(),
        isDev ? new Refresh({
            overlay: {
                // sockIntegration: 'whm',
            },
        }) : false,
        // new ForkTsCheckerWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
            // 'process.env.MODULE_MODE': `"${process.env.NODE_ENV === 'development' ?'sync' :'lazy'}"`,
            'process.env.MODULE_MODE': `'lazy'`,
        }),
        !isDev ? new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }) : false,
        new Dotenv({
            path: EnvFile,
        }),
        new CleanWebpackPlugin({}),
        new HtmlWebpackPlugin(isDev ? {
            title: process.env.APP_NAME,
            filename: "index.html",
            meta: {
                'viewport': "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
            }
        } : {
            title: process.env.APP_NAME,
            filename: "index.html",
            base: '/',
            meta: {
                'viewport': "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
            }
        }),
    ].filter(Boolean),

};


