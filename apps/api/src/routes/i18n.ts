import { Hono } from "hono";

// This is a simulated backend for serving translations
// In a real database scenario, this would fetch from a table

const translations: Record<string, Record<string, Record<string, string>>> = {
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

const i18nRouter = new Hono().get("/:lng/:ns", (c) => {
	const lng = c.req.param("lng");
	const ns = c.req.param("ns");

	if (translations[lng]?.[ns]) {
		return c.json(translations[lng][ns]);
	}

	return c.json({});
});

export default i18nRouter;
