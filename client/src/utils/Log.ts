import winston from "winston";

const log = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "foster-cat-service" },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

//
// If we're not in production then log includes debug messages
//
if (process.env.NODE_ENV !== "production") {
  log.level = "debug";
}

export default log;
