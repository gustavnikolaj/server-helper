const expect = require("unexpected").clone();
const path = require("path");
const findFilesToWatch = require("../lib/find-files-to-watch");
const fixturesRoot = path.resolve(__dirname, "../fixtures/findFilesToWatch");

const normalizePath = (origPath) => origPath.split(path.sep).join("/");

expect.addAssertion(
  "<array> to match when resolved from <string> <array>",
  (expect, subject, dirname, files) =>
    expect(
      subject.map((file) => normalizePath(path.relative(dirname, file))),
      "to equal",
      files
    )
);

expect.addAssertion(
  "<object> to yield files <array>",
  (expect, { appFileName, fixtureName, watchConfig }, value) => {
    const fixturesPath = path.resolve(fixturesRoot, fixtureName);
    const appFileNamePath = path.resolve(fixturesPath, appFileName);
    if (Array.isArray(watchConfig)) {
      watchConfig = watchConfig.map((pattern) =>
        path.resolve(fixturesPath, pattern)
      );
    }

    return expect(
      findFilesToWatch(appFileNamePath, watchConfig),
      "to be fulfilled"
    ).then((files) =>
      expect(
        files.map((file) => normalizePath(path.relative(fixturesPath, file))),
        "to equal",
        value
      )
    );
  }
);

describe("findFilesToWatch", () => {
  it("should find files to watch in a simple server", () =>
    expect(
      {
        fixtureName: "simpleServer",
        appFileName: "app.js",
      },
      "to yield files",
      ["app.js", "dep1.js", "dep2.js", "lib/dep3.js"]
    ));

  it("should find files to watch in a simple server with config", () =>
    expect(
      {
        fixtureName: "simpleServer",
        appFileName: "app.js",
        watchConfig: "**/*.js",
      },
      "to yield files",
      ["app.js", "dep1.js", "dep2.js", "lib/dep3.js"]
    ));

  it("should find files to watch in a server with packages", () =>
    expect(
      {
        fixtureName: "serverWithPackages",
        appFileName: "server/lib/app.js",
        watchConfig: ["server/**/*.js", "packages/**/*.js"],
      },
      "to yield files",
      ["server/app.js", "server/lib/dep.js", "packages/foo/index.js"]
    ));
});
