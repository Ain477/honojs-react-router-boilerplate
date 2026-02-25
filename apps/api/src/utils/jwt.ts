import { decode, sign, verify } from "hono/jwt";

const jwt = {
	decode: (token: string) => {
		return decode(token);
	},
	sign: async (payload: Record<string, unknown>, secret: string) => {
		return await sign(payload, secret, "HS256");
	},
	verify: async (token: string, secret: string) => {
		return await verify(token, secret, "HS256");
	},
};

export default jwt;
