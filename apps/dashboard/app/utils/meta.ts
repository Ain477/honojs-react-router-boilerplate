export function metaHelper({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return [
		{ title },
		{ name: "description", content: description },
		{ property: "og:title", content: title },
		{ property: "og:description", content: description },
	];
}
