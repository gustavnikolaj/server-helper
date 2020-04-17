const path = require("path");
const { promisify } = require("util");
const glob = promisify(require("glob"));

// TODO: watch symlinked folders in node_modules folders
// TODO: watch changes in node_modules folders above the appFileName folder

module.exports = async (appFileName, watchConfig) => {
  const patterns = [];
  const appDirName = path.dirname(appFileName);

  if (typeof watchConfig === "string") {
    patterns.push(path.resolve(appDirName, watchConfig));
  } else if (Array.isArray(watchConfig)) {
    for (const pattern of watchConfig) {
      patterns.push(pattern);
    }
  } else {
    // If no watch config given, just watch all js files below the appDir
    patterns.push(path.resolve(appDirName, "**", "*.js"));
  }

  let allFileNames = [];

  for (const pattern of patterns) {
    const fileNames = await glob(pattern, {
      ignore: [
        ".#", // ignore emacs temp files
      ],
    });
    allFileNames = allFileNames.concat(fileNames);
  }

  return allFileNames;
};
