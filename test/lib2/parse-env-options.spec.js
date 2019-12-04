const parseEnvOptions = require("../../lib2/parse-env-options");
const expect = require("unexpected");

describe("parseEnvOptions", () => {
  it("should be a function", () => {
    expect(parseEnvOptions, "to be a function");
  });

  it("should throw with no args", () => {
    expect(() => parseEnvOptions(), "to throw", "You must pass in an object.");
  });

  it("should return an empty object with no options", () => {
    expect(parseEnvOptions({}), "to equal", {});
  });

  it("should return an empty object when receiving unknown keys", () => {
    expect(parseEnvOptions({ unknownOption: "foobar" }), "to equal", {});
  });

  it("should set a port using PORT", () => {
    expect(parseEnvOptions({ PORT: "3000" }), "to equal", { port: 3000 });
  });

  it("should set a port using SERVERHELPER_PORT", () => {
    expect(parseEnvOptions({ SERVERHELPER_PORT: "3000" }), "to equal", {
      port: 3000
    });
  });

  it("should set a port using SERVERHELPER_PORT over PORT", () => {
    expect(
      parseEnvOptions({ SERVERHELPER_PORT: "3000", PORT: "4000" }),
      "to equal",
      { port: 3000 }
    );
  });

  it("should set a host using SERVERHELPER_HOST", () => {
    expect(parseEnvOptions({ SERVERHELPER_HOST: "www.foo.com" }), "to equal", {
      host: "www.foo.com"
    });
  });

  it("should complain about invalid port", () => {
    expect(
      () =>
        parseEnvOptions({
          PORT: "tretusinde"
        }),
      "to throw",
      "Non number value for port."
    );
  });
});
