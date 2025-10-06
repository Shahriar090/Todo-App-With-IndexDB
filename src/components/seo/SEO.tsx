import type { SEOProps } from '@/types';
import { Helmet } from 'react-helmet-async';

const SITE_TITLE = 'Lazy Todo';
const DEFAULT_DESC = 'Manage your tasks with Lazy Todo — create, edit, categorize and track your everyday tasks.';

const SEO = ({ title, description, image, url }: SEOProps) => {
	const fullTitle = title ? `${title} | ${SITE_TITLE}` : SITE_TITLE;
	const desc = description ?? DEFAULT_DESC;
	const canonical = url ?? (typeof window !== 'undefined' ? window.location.href : '');

	return (
		<Helmet>
			<title>{fullTitle}</title>
			<meta name='description' content={desc} />
			<link rel='canonical' href={canonical} />

			{/* Open Graph */}
			<meta property='og:title' content={fullTitle} />
			<meta property='og:description' content={desc} />
			<meta property='og:url' content={canonical} />
			{image && <meta property='og:image' content={image} />}

			{/* Twitter */}
			<meta name='twitter:card' content={image ? 'summary_large_image' : 'summary'} />
			{image && <meta name='twitter:image' content={image} />}
		</Helmet>
	);
};

export default SEO;
