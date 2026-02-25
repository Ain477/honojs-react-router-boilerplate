import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { HydratedRouter } from "react-router/dom";
import i18n from "./lib/i18n";
import esCommon from "./locales/bn/common";
import enCommon from "./locales/en/common";

const resources = {
	en: { common: enCommon },
	es: { common: esCommon },
};

async function hydrate() {
	await i18next
		.use(initReactI18next)
		.use(LanguageDetector)
		.use(Backend)
		.init({
			...i18n,
			ns: ["common"],
			defaultNS: "common",
			partialBundledLanguages: true,
			resources,
			backend: {
				loadPath: "/locales/{{lng}}/{{ns}}.json", // Loads from public dir
			},
			detection: {
				order: ["htmlTag", "localStorage", "navigator"],
				caches: ["localStorage"],
			},
		});

	startTransition(() => {
		hydrateRoot(
			document,
			<I18nextProvider i18n={i18next}>
				<StrictMode>
					<HydratedRouter />
				</StrictMode>
			</I18nextProvider>,
		);
	});
}

if (window.requestIdleCallback) {
	window.requestIdleCallback(hydrate);
} else {
	window.setTimeout(hydrate, 1);
}
