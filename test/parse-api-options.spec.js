const parseApiOptions = require("../lib/parse-api-options");
const expect = require("unexpected");

describe("parseApiOptions", () => {
  it("should be a function", () => {
    expect(parseApiOptions, "to be a function");
  });

  it("should throw with no args", () => {
    expect(() => parseApiOptions(), "to throw", "options must be an object");
  });

  it("should return an empty object with no options", () => {
    expect(parseApiOptions({}), "to equal", {});
  });

  it("should throw when receiving unknown keys", () => {
    expect(
      () =>
        parseApiOptions({
          unknownOption: "foobar"
        }),
      "to throw",
      "Got unexpected options values: unknownOption"
    );
  });

  it("should enable watch mode", () => {
    expect(parseApiOptions({ watch: true }), "to equal", { watch: true });
  });

  it("should complain about invalid entrypoint", () => {
    expect(
      () =>
        parseApiOptions({
          entrypoint: null
        }),
      "to throw",
      "Expected entrypoint to be a string"
    );
  });

  it("should take an entrypoint", () => {
    expect(parseApiOptions({ entrypoint: "foo" }), "to equal", {
      entrypoint: "foo"
    });
  });

  it("should complain about an invalid port number", () => {
    expect(
      () => parseApiOptions({ port: null }),
      "to throw",
      "Expected port to be a number"
    );
  });

  it("should complain about a NaN port number", () => {
    expect(
      () => parseApiOptions({ port: NaN }),
      "to throw",
      "Expected port to be a number"
    );
  });

  it("should take a port", () => {
    expect(parseApiOptions({ port: 1234 }), "to equal", {
      port: 1234
    });
  });
});
