import { createRouter } from "@api/utils/router";
import { zValidator } from "@hono/zod-validator";
import { getLocaleParamsSchema } from "../validation";
import { getLocaleHandler } from "./get";

const i18nRouter = createRouter().get(
	"/:lng/:ns",
	zValidator("param", getLocaleParamsSchema),
	getLocaleHandler,
);

export default i18nRouter;
