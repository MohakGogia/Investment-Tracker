import { Chart } from 'primereact/chart';
import { useState, useEffect } from 'react';
import { Investment } from '../../models/investment';
import { CHART_COLORS } from '../../core/color-coding';
import { MonthData } from '../../models/chart-models';

export default function BarChart({
	investmentsData,
}: {
	investmentsData: Investment[];
}) {
	const [chartData, setChartData] = useState({});
	const [chartOptions, setChartOptions] = useState({});

	useEffect(() => {
		const barChartData: MonthData[] = prepareBarChartData(investmentsData);
		const labels: string[] = [];
		const dataObj: number[] = [];
		const bgColors: string[] = [];
		const hoverColors: string[] = [];

		barChartData.forEach((element, index) => {
			labels.push(element.month);
			dataObj.push(element.totalAmount);
			bgColors.push(CHART_COLORS[index].color);
			hoverColors.push(CHART_COLORS[index].hoverColor);
		});

		const data = {
			labels: labels,
			datasets: [
				{
					label: 'Amount (in ₹)',
					data: dataObj,
					backgroundColor: bgColors,
					hoverBackgroundColor: hoverColors,
				},
			],
			options: {
				responsive: false,
				display: true,
			},
		};

		const options = {
			scales: {
				x: {
					beginAtZero: true,
					ticks: {
						stepSize: 10000,
					},
				},
			},
			plugins: {
				title: {
					display: true,
					text: 'Monthly investment distribution',
				},
				legend: {
					labels: {
						usePointStyle: true,
					},
				},
			},
		};

		setChartData(data);
		setChartOptions(options);
	}, [investmentsData]);

	return (
		<div className='flex justify-center mt-8'>
			{investmentsData?.length === 0 ? (
				<div className='text-center text-xl text-red-400 p-4 bg-red-100 rounded-lg shadow-md'>
					No data available for this year
				</div>
			) : (
				<Chart
					type='bar'
					className='w-3/5'
					data={chartData}
					options={chartOptions}
				/>
			)}
		</div>
	);
}

function prepareBarChartData(data: Investment[]): MonthData[] {
	const groupedData: { [key: string]: number } = {};
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	// Initialize groupedData with 0 for each month
	months.forEach((month) => {
		groupedData[month] = 0;
	});

	// Group records by month and calculate total amount
	data.forEach((record) => {
		const month = new Date(record.purchasedDate).getMonth();
		const monthName = months[month];
		groupedData[monthName] += record.amount;
	});

	// Format data for bar chart
	const chartData: MonthData[] = [];
	for (const month in groupedData) {
		if (Object.prototype.hasOwnProperty.call(groupedData, month)) {
			chartData.push({ month, totalAmount: groupedData[month] });
		}
	}

	return chartData;
}
