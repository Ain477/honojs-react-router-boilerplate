import { z } from "zod";

export const getLocaleParamsSchema = z.object({
	lng: z.string().min(2),
	ns: z.string().min(1),
});
