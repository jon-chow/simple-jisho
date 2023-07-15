import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";


/**
 * Get the IP address of the request.
 */
function getIP(request: any, _response: any): string {
	return request.ip ||
	request.headers["x-forwarded-for"] ||
	request.headers["x-real-ip"] ||
	request.socket.remoteAddress;
}

/**
 * A middleware that limits the number of API calls per IP address.
 * @param limit The maximum number of requests per windowMs.
 * @param windowMs The length of the time window in milliseconds.
 * @param delayAfter The number of requests to start delaying.
 * @param delayMs The milliseconds to delay the response.
 */
export const getRateLimitMiddlewares = ({
	limit = 60,
	windowMs = 60 * 1000,
	delayAfter = Math.round(10 / 2),
	delayMs = 1000,
} = {}) => [
	slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
	rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
];
