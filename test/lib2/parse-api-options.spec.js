const parseApiOptions = require("../../lib2/parse-api-options");
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
});
