export type FilterTodoComponentProps = {
	statusFilter: 'all' | 'pending' | 'completed' | 'low' | 'medium' | 'high';
	setStatusFilter: (val: 'all' | 'pending' | 'completed' | 'low' | 'medium' | 'high') => void;
	dateFilter: 'all' | 'today' | 'thisWeek' | 'thisMonth';
	setDateFilter: (val: 'all' | 'today' | 'thisWeek' | 'thisMonth') => void;
};
