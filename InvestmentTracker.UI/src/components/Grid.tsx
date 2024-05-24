import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useState, useEffect } from 'react';
import { Investment } from '../models/investment';
import { AxiosResponse } from 'axios';
import apiService from './http/api-service';
import { Tag } from 'primereact/tag';
import { InvestmentStatus, InvestmentType } from '../core/enums';
import { FilterMatchMode } from 'primereact/api';

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

export default function Grid() {
	const [investments, setInvestments] = useState<Investment[]>([]);
	const columns = [
		{ field: 'amount', header: 'Amount', width: '10%', filter: true, filterPlaceholder: 'Search' },
		{ field: 'type', header: 'Investment Type', width: '10%', filter: true, filterPlaceholder: 'Search' },
		{ field: 'status', header: 'Investment Status', width: '10%', filter: true, filterPlaceholder: 'Search' },
		{ field: 'purchasedDate', header: 'Purchase Date', width: '10%', filter: true, filterPlaceholder: 'Search' },
		{ field: 'sellDate', header: 'Selling Date', width: '10%', filter: true, filterPlaceholder: 'Search' },
		{ field: 'duration', header: 'Holding Period', width: '10%', filter: true, filterPlaceholder: 'Search' },
		{ field: 'description', header: 'Description', width: '10%', filter: true, filterPlaceholder: 'Search' },
	];
	const [filters] = useState({
		amount: { value: null, matchMode: FilterMatchMode.EQUALS },
		type: { value: null, matchMode: FilterMatchMode.EQUALS },
		status: { value: null, matchMode: FilterMatchMode.EQUALS },
		purchasedDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
		sellDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
		duration: { value: null, matchMode: FilterMatchMode.EQUALS },
		description: { value: null, matchMode: FilterMatchMode.CONTAINS },
	});

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

	const header = (
		<div className='flex flex-wrap align-items-center justify-content-between'>
			<span className='text-xl text-900 font-bold mb-2'>Investment Data</span>
		</div>
	);

	const footer = `In total there are ${
		investments ? investments.length : 0
	} records.`;

	return (
		<div className='card mt-4 p-8 bg-white shadow-lg rounded-lg'>
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
				tableStyle={{ minWidth: '50rem' }}
				emptyMessage='No data found'
				className='custom-datatable'
				filters={filters}
				filterDisplay='row'
				header={header}
				footer={footer}
			>
				<Column // Manually add S.No column
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
			</DataTable>
		</div>
	);
}
