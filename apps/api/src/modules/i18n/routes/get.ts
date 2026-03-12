import { getTranslation } from "@modules/i18n/services";
import type { Context } from "hono";

export const getLocaleHandler = async (c: Context) => {
	// Re-cast valid params if infer types drop out, although hono gives full types from the validator generically
	const { lng, ns } = c.req.valid("param" as never) as {
		lng: string;
		ns: string;
	};

	const translation = await getTranslation(lng, ns);
	return c.json(translation);
};
