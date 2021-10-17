import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import type {Configuration} from "webpack";
import {ProvidePlugin, HotModuleReplacementPlugin} from "webpack";
import {resolve} from "path";
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

interface DevServerConfiguration {
  devServer: {
    port: number;
    host: string;
    allowedHosts: string;
    historyApiFallback: boolean;
    client: {
      webSocketURL: {
        hostname: string;
        pathname: string
        port: number;
      }
    }
    headers: {
      [key: string]: string;
    }
  }
}

const config: Configuration & DevServerConfiguration= {
  mode: "development",
  devtool: "inline-source-map",
  context: resolve(__dirname),
  entry: {
    main: resolve("./src/index.tsx"),
  },
  output: {
    path: resolve("build"),
    library: 'library', 
    crossOriginLoading: "anonymous",  
    uniqueName: 'library',
    umdNamedDefine: true,
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  target: "web",
  devServer: {
    port: 4000,
    host: "0.0.0.0",
    allowedHosts: 'all',
    historyApiFallback: true,
    client: {
      webSocketURL: {
        hostname: "localhost",
        pathname: "/ws",
        port: 4000,
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre",
      },
      {
        test: /(\.tsx|\.ts)$/,
        include: [
          resolve(__dirname, "./src"),
        ],
        use: [
          { 
            loader: "babel-loader", 
            options: {plugins: ["react-refresh/babel"]}
          },
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              projectReferences: true,
              experimentalFileCaching: true,
              configFile: "tsconfig.json",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new WebpackManifestPlugin({}),
    new ProvidePlugin({
      React:     "react",
      ReactDOM:  "react-dom",
    }),
    new HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin({
      library: 'library',
      overlay: {
        sockIntegration: 'wds',
        sockHost: "localhost",
        sockPath: "/ws",
        sockPort: 4000,
      }
    }),
  ],
};

export default config;