import { Search } from "@/routes/_authenticated/components/search";
import { metaHelper } from "@/utils/meta";
import type { Route } from "./+types/route";
import SettingsLayout from "./settings-layout";

export const meta: Route.MetaFunction = () => {
	return metaHelper({
		title: "Settings",
		description: "Manage your account settings.",
	});
};

export const handle = {
	header: {
		customContent: <Search />,
	},
};

export default function SettingsRoute() {
	return <SettingsLayout />;
}
