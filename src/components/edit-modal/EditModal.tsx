/** biome-ignore-all lint/correctness/useUniqueElementIds: removed dynamic id error  */
import { currentSelectedUserId } from '@/redux/features/auth/auth-slice/authSlice';
import { useAddCategoryMutation, useGetCategoriesQuery, useUpdateTodoMutation } from '@/redux/features/todo/todo.api';
import { useAppSelector } from '@/redux/hooks';
import type { CategoryType, EditModalProps, PriorityType, TodoType } from '@/types/types';
import { createMarkdownContent } from '@/utils/markdown-utils/createMarkdownContent';
import { extractDescriptionFromMarkdown } from '@/utils/markdown-utils/extractDescription';
import { extractTitleFromMarkdownContent } from '@/utils/markdown-utils/extractTitle';
import MDEditor from '@uiw/react-md-editor';
import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// Category form type
type CategoryFormInputs = {
	name: string;
	color: string;
};

const EditModal = ({ open, onClose, todo, onConfirm }: EditModalProps) => {
	const [_, { isLoading }] = useUpdateTodoMutation();
	const userId = useAppSelector(currentSelectedUserId);
	const { data: categoriesData } = useGetCategoriesQuery();
	const [addCategory, { isLoading: isAddingCategory }] = useAddCategoryMutation();

	// Modal state for category creation
	const [showCategoryModal, setShowCategoryModal] = useState(false);
	// Markdown editor state
	const [markdownContent, setMarkdownContent] = useState('');

	const { register, handleSubmit, reset, setValue } = useForm<TodoType>({
		defaultValues: {
			title: '',
			description: '',
			priority: 'low',
			category: '',
			dueDate: '',
		},
	});

	// Category form
	const {
		register: registerCategory,
		handleSubmit: handleSubmitCategory,
		formState: { errors: categoryErrors },
		reset: resetCategory,
		watch: watchCategory,
	} = useForm<CategoryFormInputs>({
		defaultValues: {
			name: '',
			color: '#3b82f6', // Default blue color
		},
	});

	// const selectedPriority = watch('priority');
	// const selectedCategory = watch('category');
	const selectedColor = watchCategory('color');

	useEffect(() => {
		if (todo) {
			reset({
				title: todo.title || '',
				description: todo.description || '',
				priority: todo.priority || 'low',
				category: todo.category || '',
				dueDate: todo.dueDate || '',
			});

			// Create markdown content from existing title and description
			const content = createMarkdownContent(todo?.title || '', todo?.description || '');
			setMarkdownContent(content);
		}
	}, [todo, reset]);

	// handle markdown content change
	// when user types anything using the markdown editor, typed things will come as 'value' and then
	//  it will set into markdown content state as content
	const handleMarkdownContentChange = (value?: string) => {
		const content = value || '';
		setMarkdownContent(content);

		// Extract title and description from markdown and update form
		const extractedTitle = extractTitleFromMarkdownContent(content);
		const extractedDescription = extractDescriptionFromMarkdown(content);

		setValue('title', extractedTitle);
		setValue('description', extractedDescription);
	};

	const onSubmit = async (payload: TodoType) => {
		// Extract final title and description from current markdown content
		const finalTitle = extractTitleFromMarkdownContent(markdownContent);
		const finalDescription = extractDescriptionFromMarkdown(markdownContent);

		const updatedPayload = {
			...payload,
			title: finalTitle,
			description: finalDescription,
		};

		if (onConfirm) onConfirm(updatedPayload);
	};

	// Handle category change
	const handleCategoryChange = (value: string) => {
		if (value === '__new__') {
			setShowCategoryModal(true);
		} else {
			setValue('category', value);
		}
	};

	// Handle category creation
	const onCategorySubmit = async (payload: CategoryFormInputs) => {
		try {
			const newCat = await addCategory({
				name: payload.name,
				color: payload.color,
				userId,
			}).unwrap();

			setValue('category', newCat.id);
			toast.success('Category created successfully!');
			setShowCategoryModal(false);
			resetCategory();
		} catch (error) {
			console.error('Failed to create category:', error);
			toast.error('Failed to create category');
		}
	};

	const closeCategoryModal = () => {
		setShowCategoryModal(false);
		resetCategory();
	};

	if (!open) return null;

	return (
		<>
			<Card className='bg-zinc-900 border-zinc-700 text-zinc-200 w-full max-w-xl'>
				<CardHeader>
					<CardTitle>Update Todo</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
						{/* Title */}
						{/* <div className='space-y-1'>
							<Label htmlFor='title' className='text-sm'>
								Title
							</Label>
							<Input
								id='title'
								placeholder='Enter todo title'
								className='bg-zinc-800 border-zinc-700 py-5'
								{...register('title', { required: true })}
							/>
						</div> */}

						{/* Description */}
						{/* <div className='space-y-1'>
							<Label htmlFor='description' className='text-sm'>
								Description
							</Label>
							<Input
								id='description'
								placeholder='Optional description'
								className='bg-zinc-800 border-zinc-700 py-5'
								{...register('description')}
							/>
						</div> */}

						{/* Markdown Editor for Title and Description */}
						<div className='space-y-1'>
							<Label className='text-sm'>Content (Enter title in the first line, then add description below)</Label>
							<div className='rounded-lg overflow-hidden border border-zinc-700'>
								<MDEditor
									value={markdownContent}
									onChange={handleMarkdownContentChange}
									preview='edit'
									hideToolbar={false}
									textareaProps={{
										placeholder: '# Enter your todo title here\n\nAdd your description here with markdown support...',
										style: {
											fontSize: 14,
											backgroundColor: '#27272a',
											color: '#d4d4d8',
										},
									}}
									height={200}
									data-color-mode='dark'
								/>
							</div>
							<p className='text-xs text-zinc-500'>
								Tip: Start with # for the title, then add your description below with full markdown support
							</p>
						</div>

						{/* Priority */}
						<div className='space-y-1'>
							<Label htmlFor='priority' className='text-sm'>
								Priority
							</Label>
							<Select
								// value={selectedPriority}
								defaultValue={todo?.priority}
								onValueChange={(value) => setValue('priority', value as PriorityType)}>
								<SelectTrigger className='bg-zinc-800 border-zinc-700 w-full py-5'>
									<SelectValue placeholder='Select priority' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='low'>Low</SelectItem>
									<SelectItem value='medium'>Medium</SelectItem>
									<SelectItem value='high'>High</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Category */}
						<div className='space-y-1'>
							<Label htmlFor='category' className='text-sm'>
								Category
							</Label>
							<Select
								// value={selectedCategory}
								defaultValue={todo?.category}
								onValueChange={handleCategoryChange}>
								<SelectTrigger className='bg-zinc-800 border-zinc-700 w-full py-5'>
									<SelectValue placeholder='Select category' />
								</SelectTrigger>
								<SelectContent>
									{categoriesData?.categories.map((cat: CategoryType) => (
										<SelectItem key={cat.id} value={cat.id}>
											<div className='flex items-center gap-2'>
												<div className='w-3 h-3 rounded-full' style={{ backgroundColor: cat.color }} />
												{cat.name}
											</div>
										</SelectItem>
									))}
									<SelectItem value='__new__'>
										<div className='flex items-center gap-2'>
											<Plus className='w-4 h-4' />
											Add new category
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Due Date */}
						<div className='space-y-1'>
							<Label htmlFor='dueDate' className='text-sm'>
								Due Date
							</Label>
							<Input type='date' id='dueDate' className='bg-zinc-800 border-zinc-700 py-5' {...register('dueDate')} />
						</div>

						{/* Buttons */}
						<div className='flex justify-end items-center gap-3 pt-4'>
							<Button
								type='button'
								onClick={onClose}
								variant='outline'
								className='bg-transparent border-zinc-700 text-zinc-200 hover:bg-zinc-800'>
								Cancel
							</Button>

							<Button type='submit' className='bg-blue-600 hover:bg-blue-700 text-white' disabled={isLoading}>
								{isLoading ? 'Updating...' : 'Update Todo'}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			{/* Category Creation Modal */}
			{showCategoryModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-zinc-900 border border-zinc-700 rounded-lg p-6 w-full max-w-md mx-4'>
						<div className='flex items-center justify-between mb-4'>
							<h2 className='text-lg font-semibold text-zinc-200'>Create New Category</h2>
							<Button
								variant='ghost'
								size='sm'
								onClick={closeCategoryModal}
								className='text-zinc-400 hover:text-zinc-200 p-1'>
								<X className='w-4 h-4' />
							</Button>
						</div>

						<form onSubmit={handleSubmitCategory(onCategorySubmit)} className='space-y-4'>
							{/* Category Name */}
							<div className='space-y-1'>
								<Label htmlFor='categoryName' className='text-sm text-zinc-200'>
									Category Name
								</Label>
								<Input
									id='categoryName'
									placeholder='Enter category name'
									className='bg-zinc-800 border-zinc-700 py-3'
									{...registerCategory('name', { required: 'Category name is required' })}
								/>
								{categoryErrors.name && <p className='text-red-500 text-sm'>{categoryErrors.name.message}</p>}
							</div>

							{/* Category Color */}
							<div className='space-y-1'>
								<Label htmlFor='categoryColor' className='text-sm text-zinc-200'>
									Category Color
								</Label>
								<div className='flex items-center gap-3'>
									<input
										id='categoryColor'
										type='color'
										className='w-12 h-10 rounded border border-zinc-700 bg-zinc-800 cursor-pointer'
										{...registerCategory('color')}
									/>
									<Input
										placeholder='#3b82f6'
										value={selectedColor}
										onChange={(e) => registerCategory('color').onChange(e)}
										className='bg-zinc-800 border-zinc-700 py-3 flex-1'
									/>
								</div>
								{categoryErrors.color && <p className='text-red-500 text-sm'>{categoryErrors.color.message}</p>}
							</div>

							{/* Color Preview */}
							<div className='flex items-center gap-2 text-sm text-zinc-400'>
								<span>Preview:</span>
								<div className='flex items-center gap-2'>
									<div
										className='w-4 h-4 rounded-full border border-zinc-600'
										style={{ backgroundColor: selectedColor }}
									/>
									<span className='text-zinc-200'>Sample Category</span>
								</div>
							</div>

							<div className='flex gap-3 pt-2'>
								<Button
									type='button'
									variant='outline'
									onClick={closeCategoryModal}
									className='flex-1 bg-transparent border-zinc-700 text-zinc-200 hover:bg-zinc-800'>
									Cancel
								</Button>
								<Button
									type='submit'
									disabled={isAddingCategory}
									className='flex-1 bg-blue-600 hover:bg-blue-700 text-white'>
									{isAddingCategory ? 'Creating...' : 'Create Category'}
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
};

export default EditModal;
