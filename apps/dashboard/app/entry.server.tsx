import { createInstance } from "i18next";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";

import i18nConfig from "./lib/i18n";
import bnCommon from "./locales/bn/common";
import enCommon from "./locales/en/common";

const resources = {
	en: { common: enCommon },
	bn: { common: bnCommon },
};

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	routerContext: EntryContext,
	_loadContext: AppLoadContext,
) {
	const instance = createInstance();
	const acceptLang = request.headers.get("Accept-Language");
	const lng = acceptLang?.includes("bn") ? "bn" : "en";

	await instance.use(initReactI18next).init({
		...i18nConfig,
		lng,
		ns: ["common"],
		resources,
	});

	let shellRendered = false;
	const userAgent = request.headers.get("user-agent");

	const body = await renderToReadableStream(
		<I18nextProvider i18n={instance}>
			<ServerRouter context={routerContext} url={request.url} />
		</I18nextProvider>,
		{
			onError(error: unknown) {
				responseStatusCode = 500;
				if (shellRendered) {
					console.error(error);
				}
			},
		},
	);
	shellRendered = true;

	if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
		await body.allReady;
	}

	responseHeaders.set("Content-Type", "text/html");
	return new Response(body, {
		headers: responseHeaders,
		status: responseStatusCode,
	});
}
