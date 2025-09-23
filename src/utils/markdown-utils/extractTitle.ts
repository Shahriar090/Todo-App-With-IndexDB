// helper function to extract title from markdown content
export const extractTitleFromMarkdownContent = (content: string): string => {
	const lines = content.split('\n');

	// const titleFromLines = lines.find((line) => line.trim().startsWith('# '));
	// return titleFromLines ? titleFromLines.replace('# ', '').trim() : '';

	// ***************** NOTE ********************//
	// Previously, I used simple string replacement which could remove any "# " in the line,
	// causing the title to be overridden if another heading appeared later in the content.
	// Now, I am using a regex /^#\s+/ to remove only the "#" at the start of the line,
	// ensuring we extract only the first heading as the main title.
	// ********************************************************************************************

	// find first line that starts with "# "
	const firstTitleLine = lines.find((line) => line.trim().startsWith('# '));

	return firstTitleLine ? firstTitleLine.replace(/^#\s+/, '').trim() : '';
};
