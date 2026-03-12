// import { fetchTranslationsFromDB } from "../db";

const fallbackTranslations: Record<
	string,
	Record<string, Record<string, string>>
> = {
	en: {
		common: {
			welcome: "Welcome",
			what_is_next: "What's next?",
			react_router_docs: "React Router Docs",
			join_discord: "Join Discord",
		},
	},
	es: {
		common: {
			welcome: "Bienvenido",
			what_is_next: "¿Qué sigue?",
			react_router_docs: "Documentación de React Router",
			join_discord: "Únete a Discord",
		},
	},
};

export const getTranslation = async (lng: string, ns: string) => {
	// const dbResult = await fetchTranslationsFromDB(lng, ns);
	// if (dbResult) return dbResult;

	if (fallbackTranslations[lng]?.[ns]) {
		return fallbackTranslations[lng][ns];
	}

	return {};
};
