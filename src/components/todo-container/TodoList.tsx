import { useDeleteTodoMutation, useGetCategoriesQuery, useUpdateTodoMutation } from '@/redux/features/todo/todo.api';
import type { TodoType } from '@/types';
import { getCategoryById } from '@/utils/getCategoryById';
import { getPriorityColor } from '@/utils/getPriorityColor';
import { createMarkdownContent } from '@/utils/markdown-utils/createMarkdownContent';
import MDEditor from '@uiw/react-md-editor';
import { Calendar, CheckCircle2, Clock, Eye, EyeClosed, PenBox, Tag, Trash } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

const EditModal = lazy(() => import('@/components/edit-modal/EditModal'));
const DeleteModal = lazy(() => import('@/components/delete-modal/DeleteModal'));

const TodoList = ({
	searchQuery,
	currentItems,
	filteredTodosAfterSearch,
}:{searchQuery:string;currentItems:TodoType[];filteredTodosAfterSearch:TodoType[]}) => {
	// getting categories using rtk query hooks
	const { data: categoriesData } = useGetCategoriesQuery();
	const [updateTodo] = useUpdateTodoMutation();
	const [deleteTodo] = useDeleteTodoMutation();

	// states for delete logic
	const [selectedTodo, setSelectedTodo] = useState<TodoType | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	// states for update
	const [editingTodo, setEditingTodo] = useState<TodoType | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

	// state for expand todo
	const [expandedTodoId, setExpandedTodoId] = useState<string | null>(null);

	// edit todo related logic starts
	const handleEditClick = (todo: TodoType) => {
		setEditingTodo(todo);
		setIsEditModalOpen(true);
	};

	// edit handler
	const handleEditConfirm = (updated: TodoType) => {
		if (!editingTodo?.id) return;

		updateTodo({ id: editingTodo.id, payload: updated })
			.unwrap()
			.then(() => toast.success('Todo updated successfully', { duration: 2000 }))
			.catch((err) => console.error(err))
			.finally(() => {
				setIsEditModalOpen(false);
				setEditingTodo(null);
			});
	};

	// delete todo related logic start
	const handleDeleteClick = (todo: TodoType) => {
		setSelectedTodo(todo);
		setIsModalOpen(true);
	};

	// confirm delete handler
	const handleDeleteConfirm = async () => {
		if (selectedTodo?.id) {
			try {
				await deleteTodo(selectedTodo.id).unwrap();
				toast.success('Todo deleted successfully');
			} catch (error: unknown) {
				toast.error('Failed to delete todo');
				console.error(error as Error);
			}
		}
		setIsModalOpen(false);
		setSelectedTodo(null);
	};

	// toggle todo status handler
	const handleTodoToggle = async (id: string, currentStatus: boolean) => {
		try {
			await updateTodo({
				id,
				payload: { completed: !currentStatus },
			}).unwrap();
			toast.success('Todo status updated successfully');
		} catch (error) {
			console.error(error || 'Failed to update todo status');
			toast.error('Failed to update todo status');
		}
	};

	// expand toggle function
	const expandTodoToggle = (id: string) => {
		if (expandedTodoId === id) {
			setExpandedTodoId(null);
		} else {
			setExpandedTodoId(id);
		}
	};

	return (
		<div className='space-y-4'>
			<ScrollArea className='h-[600px] pr-4'>
				<div className='space-y-4'>
					{/* Empty state */}
					{filteredTodosAfterSearch.length === 0 && (
						<div className='flex flex-col items-center justify-center py-16 text-center'>
							<div className='w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4'>
								<CheckCircle2 className='w-8 h-8 text-zinc-600' />
							</div>
							<h3 className='text-lg font-semibold text-zinc-300 mb-2'>No todos found</h3>
							<p className='text-sm text-zinc-500 max-w-md'>
								{searchQuery
									? `No todos match "${searchQuery}". Try adjusting your search.`
									: 'Start by creating your first todo to get organized!'}
							</p>
						</div>
					)}

					{/* Todo items */}
					{currentItems.map((todo: TodoType) => {
						const isCompleted = todo.completed === true;
						const category = getCategoryById(todo.category, categoriesData!);
						const isExpanded = expandedTodoId === todo?.id;
						const markdownTodoContent = createMarkdownContent(todo?.title || '', todo?.description || '');
						const previewContent = markdownTodoContent.split('\n').slice(0, 2).join('\n');

						return (
							<div
								key={todo.id}
								className={`group relative rounded-xl border transition-all duration-300 ease-in-out ${
									isCompleted
										? 'border-zinc-700/50 bg-zinc-800/30'
										: 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800/70'
								} ${isExpanded ? 'shadow-lg' : 'shadow-sm hover:shadow-md'}`}>
								{/* Priority indicator */}
								{todo.priority && !isCompleted && (
									<div
										className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
											todo.priority === 'high'
												? 'bg-red-500'
												: todo.priority === 'medium'
													? 'bg-yellow-500'
													: 'bg-green-500'
										}`}
									/>
								)}

								<div className={`p-6 transition-all duration-300 ${isExpanded ? 'pb-8' : ''}`}>
									{/* Header */}
									<div className='flex items-start gap-4'>
										{/* Custom Checkbox */}
										<button
											type='button'
											onClick={() => handleTodoToggle(todo.id as string, isCompleted)}
											className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
												isCompleted
													? 'border-green-500 bg-green-500 text-white'
													: 'border-zinc-600 hover:border-zinc-500 group-hover:border-zinc-400'
											}`}
											aria-label='Toggle todo completion'>
											{isCompleted && <CheckCircle2 className='w-3 h-3' />}
										</button>

										{/* Content */}
										<div className='flex-1 min-w-0 space-y-3'>
											{/* Markdown content */}
											<div className={`transition-all duration-200 ${isCompleted ? 'opacity-60' : ''}`}>
												<div className={isCompleted ? 'line-through' : ''}>
													<MDEditor.Markdown
														source={isExpanded ? markdownTodoContent : previewContent}
														style={{
															backgroundColor: 'transparent',
															color: isCompleted ? '#a1a1aa' : '#e4e4e7',
															fontSize: '14px',
															lineHeight: '1.6',
															fontFamily: 'inherit',
														}}
													/>
												</div>
											</div>

											{/* Metadata */}
											<div className='flex flex-wrap gap-2'>
												{/* Due Date */}
												{todo.dueDate && (
													<Badge variant='secondary' className='bg-amber-500/20 text-amber-300 border-0 font-medium'>
														<Calendar className='w-3 h-3 mr-1' />
														Due: {new Date(todo.dueDate).toLocaleDateString()}
													</Badge>
												)}

												{/* Priority */}
												{todo.priority && (
													<Badge
														variant='secondary'
														className={`${getPriorityColor(todo.priority)} border-0 font-medium`}>
														<div
															className={`w-2 h-2 rounded-full mr-2 ${
																todo.priority === 'high'
																	? 'bg-red-500'
																	: todo.priority === 'medium'
																		? 'bg-yellow-500'
																		: 'bg-green-500'
															}`}
														/>
														{todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
													</Badge>
												)}

												{/* Category */}
												{category && (
													<Badge variant='secondary' className='bg-zinc-700/60 text-zinc-300 border-0'>
														<Tag className='w-3 h-3 mr-1' />
														<div className='w-2 h-2 rounded-full mr-1' style={{ backgroundColor: category.color }} />
														{category.name}
													</Badge>
												)}

												{/* Created Date */}
												<Badge variant='secondary' className='bg-zinc-700/40 text-zinc-400 border-0'>
													<Clock className='w-3 h-3 mr-1' />
													Created {new Date(todo.createdAt as string).toLocaleDateString()}
												</Badge>

												{/* Status */}
												<Badge
													variant='secondary'
													className={`border-0 font-medium ${
														!isCompleted ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'
													}`}>
													{!isCompleted ? 'Pending' : 'Completed'}
												</Badge>
											</div>
										</div>

										{/* Actions */}
										<div className='flex-shrink-0 flex gap-2'>
											<Button
												onClick={() => expandTodoToggle(todo.id)}
												size='sm'
												variant='ghost'
												className='h-8 px-3 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/60'
												aria-label={isExpanded ? 'Collapse todo' : 'Expand todo'}>
												{isExpanded ? <EyeClosed className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
											</Button>

											<Button
												onClick={() => handleEditClick(todo)}
												size='sm'
												variant='ghost'
												className='h-8 px-3 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/60'
												aria-label='Edit todo'>
												<PenBox className='w-4 h-4' />
											</Button>

											<Button
												onClick={() => handleDeleteClick(todo)}
												size='sm'
												variant='ghost'
												className='h-8 px-3 text-zinc-400 hover:text-red-400 hover:bg-red-500/10'
												aria-label='Delete todo'>
												<Trash className='w-4 h-4' />
											</Button>
										</div>
									</div>

									{/* Status indicator at bottom */}
									<div
										className={`mt-4 pt-4 border-t border-zinc-700/50 transition-all duration-300 ${
											isExpanded ? 'opacity-100' : 'opacity-0 h-0 mt-0 pt-0 border-t-0 overflow-hidden'
										}`}>
										<div className='flex items-center justify-between text-xs'>
											<div className='flex items-center gap-4 text-zinc-500'>
												<span>Status: {isCompleted ? 'Completed' : 'In Progress'}</span>
												{todo.dueDate && <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>}
											</div>
											<div className='text-zinc-600'>ID: {todo.id.slice(-8)}</div>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</ScrollArea>

			{/* Modals */}
			<Suspense
				fallback={
					<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
						<div className='text-white'>Loading...</div>
					</div>
				}>
				{isModalOpen && selectedTodo && (
					<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
						<DeleteModal
							open={isModalOpen}
							onClose={() => setIsModalOpen(false)}
							onConfirm={handleDeleteConfirm}
							itemName={selectedTodo?.title}
						/>
					</div>
				)}
			</Suspense>

			<Suspense
				fallback={
					<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
						<div className='text-white'>Loading...</div>
					</div>
				}>
				{isEditModalOpen && editingTodo && (
					<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
						<EditModal
							open={isEditModalOpen}
							onClose={() => setIsEditModalOpen(false)}
							todo={editingTodo}
							onConfirm={handleEditConfirm}
						/>
					</div>
				)}
			</Suspense>
		</div>
	);
};

export default TodoList;
