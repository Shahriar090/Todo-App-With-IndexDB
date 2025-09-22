// helper function to extract description from markdown content
export const extractDescriptionFromMarkdown = (content: string): string => {
	const lines = content.split('\n');

	const titleIndex = lines.findIndex((line) => line.startsWith('# '));

	if (titleIndex === -1) {
		return content.trim(); // no title found, entire content is description
	}

	// Get everything after the title line
	const descriptionLines = lines.slice(titleIndex + 1);
	return descriptionLines.join('\n').trim();
};
