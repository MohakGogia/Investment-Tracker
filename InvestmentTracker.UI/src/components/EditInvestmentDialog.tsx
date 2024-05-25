import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InvestmentStatus, InvestmentType } from '../core/enums';
import { IFormInput } from '../models/form-model';
import { Investment } from '../models/investment';
import { InputTextarea } from 'primereact/inputtextarea';

type EditInvestmentDialogProps = {
	visible: boolean;
	onHide: () => void;
	investment: Investment;
	onSave: (data: IFormInput) => void;
};

const EditInvestmentDialog: React.FC<EditInvestmentDialogProps> = ({
	visible,
	onHide,
	investment,
	onSave,
}) => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
	} = useForm<IFormInput>({
		defaultValues: investment,
	});

	useEffect(() => {
		if (investment) {
			setValue('amount', investment.amount);
			setValue('type', investment.type);
			setValue('purchasedDate', new Date(investment.purchasedDate));
			setValue(
				'sellDate',
				investment.sellDate ? new Date(investment.sellDate) : null
			);
			setValue('description', investment.description);
			setValue('status', investment.status);
		}
	}, [investment, setValue]);

	const handleEditInvestmentSave = (data: IFormInput) => {
		onSave(data);
		onHide();
	};

	const editDialogFooterContent = (
		<div>
			<Button
				label='Cancel'
				icon='pi pi-times'
				onClick={() => onHide()}
				className='p-button-text'
			/>
			<Button
				label='Save'
				icon='pi pi-check'
				onClick={handleSubmit(handleEditInvestmentSave)}
				className='px-6'
				autoFocus
			/>
		</div>
	);

	return (
		<Dialog
			visible={visible}
			style={{ width: '32rem', height: 'auto' }}
			header='Investment Details'
			modal
			className='p-fluid'
			onHide={() => onHide()}
			footer={editDialogFooterContent}
		>
			<div>
				<div className='mb-4'>
					<label htmlFor='amount'>Amount</label>
					<InputText
						id='amount'
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
						<small className='p-error'>{errors.amount.message}</small>
					)}
				</div>

				<div className='mb-4'>
					<label htmlFor='type'>
						Investment Type<span className='text-red-500'>*</span>
					</label>
					<select
						{...register('type', { required: 'Investment type is required' })}
						className='w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500'
					>
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
						<small className='p-error'>{errors.type.message}</small>
					)}
				</div>

				<div className='mb-4'>
					<label htmlFor='purchasedDate'>Purchase Date</label>
					<Controller
						name='purchasedDate'
						control={control}
						render={({ field }) => (
							<Calendar
								id='purchasedDate'
								dateFormat='dd/mm/yy'
								{...field}
								value={field.value}
								className={`custom-input w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500${
									errors.purchasedDate ? 'custom-input-error' : ''
								}`}
								showIcon
								showButtonBar
							/>
						)}
					/>
					{errors.purchasedDate && (
						<small className='p-error'>{errors.purchasedDate.message}</small>
					)}
				</div>

				<div className='mb-4'>
					<label htmlFor='sellDate'>Selling Date</label>
					<Controller
						name='sellDate'
						control={control}
						render={({ field }) => (
							<Calendar
								id='sellDate'
								dateFormat='dd/mm/yy'
								{...field}
								value={field.value}
								className='custom-input w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500'
								showIcon
								showButtonBar
							/>
						)}
					/>
				</div>

				<div className='mb-4'>
					<label htmlFor='description'>Description / Note</label>
					<InputTextarea
						id='description'
						{...register('description')}
						className='w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500'
					/>
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
									value={InvestmentStatus[key as keyof typeof InvestmentStatus]}
								>
									{key}
								</option>
							))}
					</select>
					{errors.status && (
						<small className='p-error'>{errors.status.message}</small>
					)}
				</div>
			</div>
		</Dialog>
	);
};

export default EditInvestmentDialog;
