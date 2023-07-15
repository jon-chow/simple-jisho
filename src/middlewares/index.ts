import { NextApiRequest, NextApiResponse } from 'next';


/**
 * Applies a middleware to the given request and response objects.
 * @param middleware The middleware to apply.
 * @returns A promise that resolves when the middleware is done.
 */
export const applyMiddleware = (middleware: any) => (request: NextApiRequest, response: NextApiResponse) =>
		new Promise((resolve, reject) => {
			middleware(request, response, (result: any) =>
				result instanceof Error ? reject(result) : resolve(result)
			);
		});
