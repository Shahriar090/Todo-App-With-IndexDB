import { useParams } from 'react-router';

const TodoDetails = () => {
	const { id } = useParams();
	return <div>TodoDetails and Id of {id}</div>;
};

export default TodoDetails;
