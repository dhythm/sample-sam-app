import { sync } from "glob";
import { resolve } from "path";
import * as Webpack from "webpack";

/** ビルド対象ルートディレクトリ */
const SRC_PATH = resolve(__dirname, "./src/functions/");
/** entryとなるファイル名 */
const ENTRY_NAME = "index.ts";
/** ビルド結果出力先 */
const BUILT_PATH = resolve(__dirname, "./built");
/** ビルド種別 */
const BUILD_VARIANT = process.env.NODE_ENV;

/**
 * ビルド対象のentryを解決する
 * @returns {Webpack.Entry} entry
 */
const resolveEntry = (): Webpack.Entry => {
  const entries: { [key: string]: string } = {};
  const targets: string[] = sync(`${SRC_PATH}/**/${ENTRY_NAME}`);
  // const pathRegex = new RegExp(`${SRC_PATH}/(.+?)/(.+?)/${ENTRY_NAME}`);
  const pathRegex = new RegExp(`${SRC_PATH}/(.+?)/${ENTRY_NAME}`);
  targets.forEach((value: string) => {
    let key: string;
    switch (BUILD_VARIANT) {
      case "production":
        // key = value.replace(pathRegex, "prd_$1_$2/index");
        key = value.replace(pathRegex, "prd_$1/index");
        break;
      case "development":
        // key = value.replace(pathRegex, "dev_$1_$2/index");
        key = value.replace(pathRegex, "$1/index");
        break;
    }
    entries[key] = value;
  });

  return entries;
};

const config: Webpack.Configuration = {
  target: "node",
  mode: BUILD_VARIANT === "production" ? "production" : "development",
  resolve: {
    extensions: [".ts", ".js"]
  },
  entry: resolveEntry(),
  output: {
    filename: "[name].js",
    path: BUILT_PATH,
    library: "[name]",
    libraryTarget: "commonjs2"
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "awesome-typescript-loader"
      }
    ]
  }
};

export default config;
