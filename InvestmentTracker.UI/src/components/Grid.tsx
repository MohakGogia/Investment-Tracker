import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useState, useEffect, useRef } from 'react';
import { Investment } from '../models/investment';
import { AxiosResponse } from 'axios';
import apiService from './http/api-service';
import { Tag } from 'primereact/tag';
import { InvestmentStatus, InvestmentType } from '../core/enums';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import EditInvestmentDialog from './EditInvestmentDialog';
import { IFormInput } from '../models/form-model';
import { Nullable } from 'primereact/ts-helpers';
import { Calendar } from 'primereact/calendar';

const today = new Date();
const oneYearAgo = new Date();
oneYearAgo.setFullYear(today.getFullYear() - 1);

const fetchInvestments = (
	startDate: Date | null,
	endDate: Date | null
): Promise<AxiosResponse<Investment[]>> => {
	const fromDate = startDate !== null ? startDate.toISOString() : null;
	const toDate = endDate !== null ? endDate.toISOString() : null;
	return apiService.get<Investment[]>('/Investment', { fromDate, toDate });
};

const getSeverity = (status: number) => {
	switch (status) {
		case InvestmentStatus.Active:
			return 'success';

		case InvestmentStatus.Sold:
			return 'danger';

		case InvestmentStatus.Matured:
			return 'warning';

		default:
			return null;
	}
};

const columns = [
	{ field: 'amount', header: 'Amount', width: '10%', filter: true, filterPlaceholder: 'Search' },
	{ field: 'type', header: 'Investment Type', width: '10%', filter: true, filterPlaceholder: 'Search' },
	{ field: 'status', header: 'Investment Status', width: '5%', filter: true, filterPlaceholder: 'Search' },
	{ field: 'purchasedDate', header: 'Purchase Date', width: '10%', filter: true, filterPlaceholder: 'Search' },
	{ field: 'sellDate', header: 'Selling Date', width: '10%', filter: true, filterPlaceholder: 'Search' },
	{ field: 'duration', header: 'Holding Period', width: '10%', filter: true, filterPlaceholder: 'Search' },
	{ field: 'description', header: 'Description', width: '5%', filter: true, filterPlaceholder: 'Search' },
];

const filters = {
	amount: { value: null, matchMode: FilterMatchMode.EQUALS },
	type: { value: null, matchMode: FilterMatchMode.EQUALS },
	status: { value: null, matchMode: FilterMatchMode.EQUALS },
	purchasedDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
	sellDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
	duration: { value: null, matchMode: FilterMatchMode.EQUALS },
	description: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

export default function Grid() {
	const [investments, setInvestments] = useState<Investment[]>([]);
	const [visible, setVisible] = useState(false);
	const toast = useRef<Toast>(null);
	const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
	const [startDate, setStartDate] = useState<Nullable<Date>>(oneYearAgo);
	const [endDate, setEndDate] = useState<Nullable<Date>>(today);
	const [isloading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			const res = await fetchInvestments(oneYearAgo, today);
			setInvestments(res.data);
		})();
	}, []);

	const getCellData = (rowData: Investment, column: { field: string }) => {
		switch (column.field) {
			case 'amount':
				return `₹ ${rowData.amount}`;
			case 'type':
				return `${InvestmentType[rowData.type]}`;
			case 'status':
				return (
					<Tag
						value={InvestmentStatus[rowData.status]}
						severity={getSeverity(rowData.status)}
					></Tag>
				);
			case 'purchasedDate':
				return new Date(rowData.purchasedDate).toDateString();
			case 'sellDate':
				return rowData.sellDate
					? new Date(rowData.sellDate).toDateString()
					: '-';
			case 'duration':
				return `${rowData.duration} days`;
			case 'description':
				return rowData.description!.length > 0 ? rowData.description : '-';
			default:
				return null;
		}
	};

	const handleInvestmentsDataFetch = async () => {
		if (startDate === null || endDate === null) {
			return;
		}
		setIsLoading(true);
		const res = await fetchInvestments(startDate as Date, endDate as Date);
		setInvestments(res.data);
		setIsLoading(false);
	}

	const header = (
		<div className='flex flex-wrap align-items-center justify-content-between m-2'>
			<span className='text-xl text-900 font-bold mb-2'>Investment Data</span>
			<div className='flex items-center space-x-4 ml-96'>
				<FloatLabel>
					<Calendar inputId="start_date" value={startDate} onChange={(e) => setStartDate(e.value)} dateFormat="dd/mm/yy" showIcon showButtonBar/>
					<label htmlFor="start_date">Start Date</label>
				</FloatLabel>
				<span>-</span>
				<FloatLabel>
					<Calendar inputId="end_date" value={endDate} onChange={(e) => setEndDate(e.value)} dateFormat="dd/mm/yy" showIcon showButtonBar/>
					<label htmlFor="end_date">End Date</label>
				</FloatLabel>
				<Button 
					label="Fetch"
					icon="pi pi-search"
					onClick={handleInvestmentsDataFetch} 
					loading={isloading} 
					className='border-solid border-2 border-gray-500 p-2 hover:bg-gray-800 hover:text-white' />
			</div>
		</div>
	);

	const footer = `In total there are ${investments ? investments.length : 0} records.`;

	const edit = (data: Investment) => {
		setSelectedInvestment(data);
		setVisible(true);
	};

	const confirmDelete = (data: Investment, event: React.MouseEvent<HTMLElement>) => {
		confirmPopup({
			target: event.currentTarget,
			message: 'Do you want to delete this record?',
			icon: 'pi pi-info-circle',
			defaultFocus: 'reject',
			acceptClassName: 'p-button p-button-danger px-2',
			rejectClassName: 'p-button p-button-secondary',
			accept: () => deleteData(data.id),
		});
	};

	const deleteData = async (id: number) => {
		await apiService.delete(`Investment/${id}`);
		setInvestments((prevInv) => {
			return prevInv.filter((inv) => inv.id !== id);
		})
		toast.current?.show({
			severity: 'success',
			summary: 'Successful',
			detail: 'Record has been deleted',
			life: 3000,
		});
	};

	const actionBodyTemplate = (rowData: Investment) => {
		return (
			<>
				<Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => edit(rowData)} />
				<Button icon="pi pi-trash" rounded outlined severity="danger" onClick={(event) => confirmDelete(rowData, event)} />
			</>
		);
	};

	const handleSave = async (updatedInvestment: IFormInput) => {
		const data = {
			id: selectedInvestment!.id,
			amount: Number(updatedInvestment.amount),
			type: Number(updatedInvestment.type),
			purchasedDate: new Date(updatedInvestment.purchasedDate),
			sellDate: updatedInvestment.sellDate
				? new Date(updatedInvestment.sellDate)
				: null,
			description: updatedInvestment.description,
			status: Number(updatedInvestment.status),
		};
		try {
			const response = await apiService.put(`/Investment/${selectedInvestment!.id}`, data);
			if (response.status === 204) {
				showToastMsg('success', 'Success', 'Investment modified successfully!');
				setInvestments((investmentList: Investment[]) => {
					const oldInvestment = investmentList.find((inv) => inv.id === selectedInvestment!.id);
	
					return investmentList.map((inv) => {
						if (inv.id === oldInvestment!.id) {
							return { ...oldInvestment, ...data, createdOn: new Date(), modifiedOn: new Date(), duration: 1 };
						}
						return inv;
					})
				});
			} else {
				showToastMsg('error', 'Error', 'Failed to edit investment. Please try again later.');
			}
		} catch (exception) {
			showToastMsg(
				'error',
				'Error',
				'Failed to edit investment. Please try again later.'
			);
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
		<div className='card mt-4 p-8 bg-white shadow-lg rounded-lg'>
			<Toast ref={toast} />
			<ConfirmPopup />
			<EditInvestmentDialog
				visible={visible}
				onHide={() => setVisible(false)}
				investment={selectedInvestment as Investment}
				onSave={handleSave}
			/>
			<DataTable
				value={investments}
				showGridlines
				stripedRows
				resizableColumns
				paginator
				scrollable
				removableSort
				scrollHeight='500px'
				rows={20}
				rowsPerPageOptions={[10, 20, 50, 100]}
				columnResizeMode='expand'
				size='small'
				tableStyle={{ minWidth: '30rem' }}
				emptyMessage='No data found'
				className='custom-datatable'
				filters={filters}
				loading={isloading}
				filterDisplay='row'
				header={header}
				footer={footer}
			>
				<Column // Manually added S.No column
					field='serialNo'
					header='S.No'
					body={(_rowData, { rowIndex }) => rowIndex + 1}
					style={{ width: '5%' }}
				/>
				{columns.map((col) => (
					<Column
						key={col.field}
						field={col.field}
						header={col.header}
						body={getCellData}
						style={{ width: col.width }}
						filter={col.filter}
						filterPlaceholder={col.filterPlaceholder}
						sortable
					/>
				))}
				<Column body={actionBodyTemplate} exportable={false} style={{ width: '5%' }}></Column>
			</DataTable>
		</div>
	);
}
