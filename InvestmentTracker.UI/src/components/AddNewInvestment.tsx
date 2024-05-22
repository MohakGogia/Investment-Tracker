import { useForm, SubmitHandler } from 'react-hook-form';
import { InvestmentType, InvestmentStatus } from '../core/enums';
import apiService from './http/api-service';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

type IFormInput = {
	amount: number;
	type: InvestmentType;
	purchasedDate: Date;
	sellDate?: Date | null;
	description?: string;
	status: InvestmentStatus;
};

const saveInvestment = (investmentData: IFormInput) => {
	const data = {
		amount: Number(investmentData.amount),
		type: Number(investmentData.type),
		purchasedDate: new Date(investmentData.purchasedDate),
		sellDate: investmentData.sellDate
			? new Date(investmentData.sellDate)
			: null,
		description: investmentData.description,
		status: Number(investmentData.status),
	};
	return apiService.post('/Investment', data);
};

const AddNewInvestment: React.FC = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<IFormInput>();
	const toast = useRef<Toast>(null);
	const [isLoading, setIsLoading] = useState(false);

	const onSubmit: SubmitHandler<IFormInput> = async (data) => {
		setIsLoading(true);
		try {
			const response = await saveInvestment(data);
			if (response.status === 201) {
				showToastMsg('success', 'Success', 'Investment added successfully!');
				reset();
			}
		} catch (exception) {
			showToastMsg(
				'error',
				'Error',
				'Failed to add investment. Please try again later.'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const showToastMsg = (
		severity: 'success' | 'error',
		summary: 'Success' | 'Error',
		toastMsg: string
	) => {
		toast.current?.show({
			severity: severity,
			summary: summary,
			detail: toastMsg,
			life: 3000,
		});
	};

	return (
		<div className='max-w-md mx-auto my-10 p-8 shadow-2xl rounded-2xl border-red-100 border-2'>
			<Toast ref={toast} />
			<h2 className='text-2xl font-bold mb-6'>Add New Investment</h2>
			{isLoading ? (
				<div className='card flex justify-content-center'>
					<ProgressSpinner />
				</div>
			) : (
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='mb-4'>
						<label className='block text-gray-700'>
							Amount<span className='text-red-500'>*</span>
						</label>
						<input
							type='text'
							{...register('amount', {
								required: 'Amount is required',
								pattern: {
									value: /^\d+(\.\d{1,2})?$/,
									message:
										'Invalid amount format. Should be a number with up to 2 decimal places',
								},
							})}
							className='w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500'
						/>
						{errors.amount && (
							<p className='text-red-500 text-sm mt-1'>
								{errors.amount.message}
							</p>
						)}
					</div>

					<div className='mb-4'>
						<label className='block text-gray-700'>
							Investment Type<span className='text-red-500'>*</span>
						</label>
						<select
							{...register('type', { required: 'Investment type is required' })}
							className='w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500'
						>
							<option value=''>Select</option>
							{Object.keys(InvestmentType)
								.filter((key) => isNaN(Number(key)))
								.map((key) => (
									<option
										key={key}
										value={InvestmentType[key as keyof typeof InvestmentType]}
									>
										{key}
									</option>
								))}
						</select>
						{errors.type && (
							<p className='text-red-500 text-sm mt-1'>{errors.type.message}</p>
						)}
					</div>

					<div className='mb-4'>
						<label className='block text-gray-700'>
							Purchase Date<span className='text-red-500'>*</span>
						</label>
						<input
							type='date'
							{...register('purchasedDate', {
								required: 'Purchase date is required',
							})}
							className='w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500'
						/>
						{errors.purchasedDate && (
							<p className='text-red-500 text-sm mt-1'>
								{errors.purchasedDate.message}
							</p>
						)}
					</div>

					<div className='mb-4'>
						<label className='block text-gray-700'>Sell Date</label>
						<input
							type='date'
							{...register('sellDate')}
							className='w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500'
						/>
						{errors.sellDate && (
							<p className='text-red-500 text-sm mt-1'>
								{errors.sellDate.message}
							</p>
						)}
					</div>

					<div className='mb-4'>
						<label className='block text-gray-700'>Description / Note</label>
						<textarea
							{...register('description')}
							className='w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500'
						></textarea>
						{errors.description && (
							<p className='text-red-500 text-sm mt-1'>
								{errors.description.message}
							</p>
						)}
					</div>

					<div className='mb-4'>
						<label className='block text-gray-700'>
							Investment Status<span className='text-red-500'>*</span>
						</label>
						<select
							{...register('status', {
								required: 'Investment status is required',
							})}
							className='w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500'
						>
							{Object.keys(InvestmentStatus)
								.filter((key) => isNaN(Number(key)))
								.map((key) => (
									<option
										key={key}
										value={
											InvestmentStatus[key as keyof typeof InvestmentStatus]
										}
									>
										{key}
									</option>
								))}
						</select>
						{errors.status && (
							<p className='text-red-500 text-sm mt-1'>
								{errors.status.message}
							</p>
						)}
					</div>

					<div className='flex justify-between'>
						<button
							type='submit'
							className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300'
						>
							Save
						</button>
						<button
							type='button'
							onClick={() => reset()}
							className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300'
						>
							Reset
						</button>
					</div>
				</form>
			)}
		</div>
	);
};

export default AddNewInvestment;
