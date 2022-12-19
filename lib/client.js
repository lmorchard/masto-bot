import axios from "axios";
import config from "../lib/config.js";
import logger from "../lib/logger.js";

export function Client(opts = {}) {
  const { log } = logger;
  const baseURL = config.get("apiBaseUrl");
  log.trace({ msg: "Client", baseURL });
  return axios.create({ baseURL });
}

export function AuthedClient(opts = {}) {
  const { log } = logger;
  const baseURL = config.get("apiBaseUrl");
  const accessToken = config.get("accessToken");
  log.trace({ msg: "AuthedClient", baseURL, accessToken });
  return axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
