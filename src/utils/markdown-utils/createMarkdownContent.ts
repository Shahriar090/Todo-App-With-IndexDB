// Helper function to create markdown content from title and description
export const createMarkdownContent = (title: string, description: string): string => {
	const titleSegment = title ? `#${title}` : '';
	const descriptionSegment = description || '';

	if (titleSegment && descriptionSegment) {
		return `${titleSegment} \n\n${descriptionSegment}`;
	}

	return titleSegment || descriptionSegment;
};
