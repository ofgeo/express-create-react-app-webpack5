const path = require('path');
const webpack = require('webpack');
const configFactory = require('../config/webpack.server.config');
const setupOutputFileSystem = require('./setupOutputFileSystem');
const requireFromString = require('require-from-string');

const config = configFactory('development');

const context = {
  compiler: webpack({...config, ...{stats: {colors: true}}}),
  options: {},
  router: null,
};

setupOutputFileSystem(context);

const hotRouterMiddleware = (req, res, next) => {
  return context.router(req, res, next);
};

function getFilename(serverStats, outputPath, chunkName) {
  const assetsByChunkName = serverStats.toJson().assetsByChunkName;
  let filename = assetsByChunkName[chunkName] || '';
  // If source maps are generated `assetsByChunkName.main`
  // will be an array of filenames.
  return path.join(
      outputPath,
      Array.isArray(filename)
          ? filename.find(asset => /\.js$/.test(asset))
          : filename,
  );
}

function interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj.default : obj;
}

const invalid = () => {
  // if (isInteractive) {
  //   clearConsole();
  // }
};

const done = async stats => {
  // Print webpack output
  const printStats = (childCompiler, childStats) => {
    const statsString = childStats.toString(childCompiler.options.stats);
    const name = childCompiler.options.name
        ? `Child "${childCompiler.options.name}": `
        : '';

    if (statsString.length) {
      if (childStats.hasErrors()) {
        console.error(`${name}${statsString}`);
      } else if (childStats.hasWarnings()) {
        console.warn(`${name}${statsString}`);
      } else {
        console.info(`${name}${statsString}`);
      }
    }

    let message = `${name}Compiled successfully.`;

    if (childStats.hasErrors()) {
      message = `${name}Failed to compile.`;
    } else if (childStats.hasWarnings()) {
      message = `${name}Compiled with warnings.`;
    }

    console.info(message);
  };

  // noinspection JSUnresolvedVariable
  if (context.compiler.compilers) {
    context.compiler.compilers.forEach(
        (compilerFromMultiCompileMode, index) => {
          printStats(compilerFromMultiCompileMode, stats.stats[index]);
        });
  } else {
    printStats(context.compiler, stats);
  }

  const outputFileSystem = context.outputFileSystem;
  const filename = getFilename(stats, context.compiler.outputPath, 'main');

  const buffer = outputFileSystem.readFileSync(filename);
  context.router = interopRequireDefault(requireFromString(buffer.toString()));
};

context.compiler.hooks.watchRun.tap('watchRun', invalid);
context.compiler.hooks.invalid.tap('invalid', invalid);
context.compiler.hooks.done.tap('done', done);

context.compiler.watch({}, err => {
  if (err) {
    console.error(err);
  }
});

module.exports = hotRouterMiddleware;




