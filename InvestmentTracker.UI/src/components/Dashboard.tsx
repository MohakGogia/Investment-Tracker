import { PrimeReactProvider } from 'primereact/api';
import BarChart from './Charts/BarChart';
import DoughnutChart from './Charts/DoughnutChart';
import PieChart from './Charts/PieChart';
import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { useFetch } from './hooks/useFetch';
import apiService from './http/api-service';
import { Investment } from '../models/investment';
import { Nullable } from 'primereact/ts-helpers';
import { Button } from 'primereact/button';
import { AxiosResponse } from 'axios';

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

export default function Dashboard() {
	return (
		<PrimeReactProvider>
			<TimeRangeChart />
			<YearChart />
		</PrimeReactProvider>
	);
}

const TimeRangeChart = () => {
	const [dates, setDates] = useState<Nullable<(Date | null)[]>>([
		oneYearAgo,
		today,
	]);
	const [apiFunc, setApiFunc] = useState(
		() => () => fetchInvestments(oneYearAgo, today)
	);
	const { isFetching, data, error } = useFetch(apiFunc, []);

	function onDatesChange(e: any) {
		setDates(e.value);
	}

	function fetchData() {
		setApiFunc(() => () => fetchInvestments(dates![0], dates![1]));
	}

	return (
		<div className='flex flex-col items-center p-8 bg-gray-500'>
			<div className='date-range-selector flex flex-col items-center mb-8 bg-white p-4 rounded-lg shadow-lg'>
				<div className='calendar-container mb-4 text-center'>
					<p className='text-lg font-semibold mb-2'>Select a date range:</p>
					<Calendar
						value={dates}
						onChange={onDatesChange}
						selectionMode='range'
						dateFormat='dd/mm/yy'
						readOnlyInput
						className='text-center border-solid border-b-2 border-black'
					/>
				</div>
				<Button
					label='Fetch'
					onClick={fetchData}
					className='border-solid border-2 border-gray-500 p-2 hover:bg-gray-800 hover:text-white'
				/>
			</div>
			<div className='chart-display flex justify-center w-full'>
				<div className='chart-card bg-white p-8 rounded-xl shadow-lg m-4'>
					{isFetching ? (
						<p className='text-center text-xl text-blue-500 p-4 bg-blue-100 rounded-lg shadow-md'>Loading...</p>
					) : (
						data && <PieChart investmentsData={data} />
					)}
					{error && <p className='text-center text-xl text-red-500 p-4 bg-red-100 rounded-lg shadow-md'>{error}</p>}
				</div>
				<div className='chart-card bg-white p-8 rounded-xl shadow-lg m-4'>
					{isFetching ? (
						<p className='text-center text-xl text-blue-500 p-4 bg-blue-100 rounded-lg shadow-md'>Loading...</p>
					) : (
						data && <DoughnutChart investmentsData={data} />
					)}
					{error && <p className='text-center text-xl text-red-500 p-4 bg-red-100 rounded-lg shadow-md'>{error}</p>}
				</div>
			</div>
		</div>
	);
};

const YearChart = () => {
	const [date, setDate] = useState<Date>(today);

	const [apiFunc, setApiFunc] = useState(
		() => () =>
			fetchInvestments(
				new Date(date.getFullYear(), 0, 1),
				new Date(date.getFullYear(), 11, 31)
			)
	);
	const { isFetching, data, error } = useFetch(apiFunc, []);

	function handleYearChange(e: any) {
		setDate(e.value as Date);
		setApiFunc(
			() => () =>
				fetchInvestments(
					new Date(e.value.getFullYear(), 0, 1),
					new Date(e.value.getFullYear(), 11, 31)
				)
		);
	}

	return (
		<div className='bar-chart-container'>
			<div className='flex flex-col items-center p-8 bg-gray-800'>
				<div className='date-range-selector flex flex-col items-center mb-8 bg-white p-4 rounded-lg shadow-lg'>
					<div className='calendar-container mb-4'>
						<p className='text-lg font-semibold mb-2'>Select a year:</p>
						<Calendar
							value={date}
							onChange={(e) => handleYearChange(e)}
							view='year'
							dateFormat='yy'
							className='border-solid border-b-2 border-black'
						/>
					</div>
				</div>
			</div>
			<div className='chart-card bg-white p-12 rounded-lg shadow-lg m-4'>
				{isFetching ? (
					<p className='text-center text-xl text-blue-500 p-4 bg-blue-100 rounded-lg shadow-md'>Loading...</p>
				) : (
					data && <BarChart investmentsData={data} />
				)}
				{error && <p className='text-center text-xl text-red-500 p-4 bg-red-100 rounded-lg shadow-md'>{error}</p>}
			</div>
		</div>
	);
};
