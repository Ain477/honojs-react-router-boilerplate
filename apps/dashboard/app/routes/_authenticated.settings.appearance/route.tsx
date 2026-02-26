import { metaHelper } from "@/utils/meta";
import type { Route } from "./+types/route";
import { SettingsAppearance } from "./appearance-view";

export const meta: Route.MetaFunction = () => {
	return metaHelper({
		title: "Appearance Settings",
		description: "Customize the appearance of the app.",
	});
};

export default function SettingsAppearanceRoute() {
	return <SettingsAppearance />;
}
