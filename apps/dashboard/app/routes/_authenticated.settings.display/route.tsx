import { metaHelper } from "@/utils/meta";
import type { Route } from "./+types/route";
import { SettingsDisplay } from "./display-view";

export const meta: Route.MetaFunction = () => {
	return metaHelper({
		title: "Display Settings",
		description: "Customize display settings.",
	});
};

export default function SettingsDisplayRoute() {
	return <SettingsDisplay />;
}
