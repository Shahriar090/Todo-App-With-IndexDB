import { Input } from '../ui/input';

type SearchQueryPropsTypes = {
	searchQuery: string;
	setSearchQuery: (val: string) => void;
};

const Search = ({ searchQuery, setSearchQuery }: SearchQueryPropsTypes) => {
	return (
		<Input
			type='text'
			value={searchQuery}
			onChange={(e) => setSearchQuery(e.target.value)}
			placeholder='Search Todo...'
			className='bg-zinc-800 border-zinc-700 w-48'
		/>
	);
};

export default Search;
