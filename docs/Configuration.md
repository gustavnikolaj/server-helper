# Configuration

In [12 factor apps chapter on configuration](12factor-config) a distinction
between two types of configuration is introduced. There's internal application
config, such as `config/routes.rb` in Rails, and environment specific
configuration, such as the hostname of the database server in staging.

The internal application configuration should not vary between deployments,
where the environment specific config must, by definition, vary for each
deployment.

The only configuration that `server-helper` should concern itself with is
environment specific. But even then, it is questionable how much it should grow
into that space.

A third version of configuration is the `server-helper` specific configuration
(watch-mode, in-band, app-entrypoint etc), which itself is divided into
application and environment specific configuration.

---

As configuration is resolved from the environment, it is globally available for
all the code running in the same process. That means that server-helper can just
ignore the environment variables that it doesn't need, and allow the application
to deal with that itself.

---

Environment configuration:

- `--port` cli option > `SERVERHELPER_PORT` environment variable > `PORT` environment variable > `port` options value.
- `--host` cli option > `SERVERHELPER_HOST` environment variable > `host` options value.

Application/run-time configuration:

- `--watch` cli option > `watch` options value.
- entrypoint from cli > entrypoint options value.

Watch implies `MonitoredProcess`-mode, and `inBand`-mode will be the default.

---

[12factor-config]: https://12factor.net/config
