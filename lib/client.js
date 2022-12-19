import axios from "axios";
import config from "../lib/config.js";
import logger from "../lib/logger.js";
import { OAUTH_SCOPES } from "../lib/constants.js";

export function Client(opts = {}) {
  const { log } = logger;
  const { API_BASE_URL } = config;
  log.trace({ msg: "Client", API_BASE_URL });
  return axios.create({ baseURL: API_BASE_URL });
}

export function AuthedClient(opts = {}) {
  const { log } = logger;
  const { API_BASE_URL, ACCESS_TOKEN } = config;
  log.trace({ msg: "AuthedClient", API_BASE_URL });
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });
}
