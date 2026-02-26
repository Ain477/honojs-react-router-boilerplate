import { Search } from "@/routes/_authenticated/components/search";
import { metaHelper } from "@/utils/meta";
import type { Route } from "./+types/route";
import { Apps } from "./apps-list";

export const meta: Route.MetaFunction = () => {
	return metaHelper({
		title: "Apps",
		description: "Integrate with your favorite apps.",
	});
};

export const handle = {
	header: {
		customContent: <Search />,
	},
};

export default function AppsRoute() {
	return <Apps />;
}
