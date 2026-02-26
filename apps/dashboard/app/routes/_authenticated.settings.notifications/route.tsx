import { metaHelper } from "@/utils/meta";
import type { Route } from "./+types/route";
import { SettingsNotifications } from "./notifications-view";

export const meta: Route.MetaFunction = () => {
	return metaHelper({
		title: "Notification Settings",
		description: "Manage notification settings.",
	});
};

export default function SettingsNotificationsRoute() {
	return <SettingsNotifications />;
}
