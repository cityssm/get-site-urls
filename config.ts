import http from "http";

export const throttleSleepMillis = 200;
export const maxRequestCount = 5;

export const axios_requestTimeoutMillis = 3 * 60_000;
export const axios_httpAgent = new http.Agent({
    keepAlive: true
});
