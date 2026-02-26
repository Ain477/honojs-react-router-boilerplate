import { ContentSection } from "../_authenticated.settings/components/content-section";
import { AccountForm } from "./account-form";

export function SettingsAccount() {
	return (
		<ContentSection
			title="Account"
			desc="Update your account settings. Set your preferred language and
          timezone."
		>
			<AccountForm />
		</ContentSection>
	);
}
