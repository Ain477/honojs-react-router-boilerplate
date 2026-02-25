import { CheckCheck, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
	const { i18n } = useTranslation();

	const handleLanguageChange = (lang: string) => {
		i18n.changeLanguage(lang);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Languages className="h-[1.2rem] w-[1.2rem]" />
					<span className="sr-only">Toggle language</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onClick={() => handleLanguageChange("en")}
					className="cursor-pointer"
				>
					English {i18n.language === "en" && <CheckCheck />}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => handleLanguageChange("bn")}
					className="cursor-pointer"
				>
					বাংলা (Bengali) {i18n.language === "bn" && <CheckCheck />}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
