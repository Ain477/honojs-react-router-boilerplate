import { AccountSettingsCards } from "@daveyplate/better-auth-ui";
import { ContentSection } from "@/routes/_authenticated.settings/components/content-section";

export default function SettingsProfile() {
	return (
		<ContentSection
			title="Profile"
			desc="This is how others will see you on the site."
		>
			<AccountSettingsCards />
		</ContentSection>
	);
}
