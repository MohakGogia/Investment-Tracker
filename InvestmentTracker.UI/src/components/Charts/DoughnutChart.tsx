import { Chart } from 'primereact/chart';
import { useState, useEffect } from 'react';
import { Investment } from '../../models/investment';
import { CHART_COLORS } from '../../core/color-coding';
import { InvestmentStatus } from '../../core/enums';
import { ChartData } from '../../models/chart-models';

export default function DoughnutChart({
	investmentsData,
}: {
	investmentsData: Investment[];
}) {
	const [chartData, setChartData] = useState({});
	const [chartOptions, setChartOptions] = useState({});

	useEffect(() => {
		const doughnutChartData: ChartData[] =
			prepareDoughnutChartData(investmentsData);

		const labels: string[] = [];
		const dataObj: number[] = [];
		const bgColors: string[] = [];
		const hoverColors: string[] = [];

		doughnutChartData.forEach((element, index) => {
			labels.push(`${element.name} (${element.percentage}%)`);
			dataObj.push(element.amount);
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
					borderWidth: 2,
					hoverOffset: 30,
				},
			],
			options: {
				responsive: false,
				display: true,
				maintainAspectRatio: false
			},
		};

		const options = {
			cutout: '60%',
			plugins: {
				title: {
					display: true,
					text: 'Investment distribution by status',
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
		<div className='size-96'>
			{investmentsData?.length === 0 ? (
				<div className='text-center text-xl text-red-400 p-4 bg-red-100 rounded-lg shadow-md'>
					No data available in this date range
				</div>
			) : (
				<Chart type='doughnut' data={chartData} options={chartOptions} />
			)}
		</div>
	);
}

function prepareDoughnutChartData(data: Investment[]): ChartData[] {
	// Group records by InvestmentStatus
	const groupedData: { [key: number]: Investment[] } = {};
	data.forEach((record) => {
		const statusType = record.status;
		if (!groupedData[statusType]) {
			groupedData[statusType] = [];
		}
		groupedData[statusType].push(record);
	});

	// Calculate total amount for each group
	const chartData: ChartData[] = [];
	let totalAmount = 0;
	for (const status in groupedData) {
		if (Object.prototype.hasOwnProperty.call(groupedData, status)) {
			const groupAmount = groupedData[status].reduce(
				(sum, record) => sum + record.amount,
				0
			);
			chartData.push({
				name: InvestmentStatus[status],
				amount: groupAmount,
				percentage: '',
			});
			totalAmount += groupAmount;
		}
	}

	// Calculate percentage share for each group
	chartData.forEach((item) => {
		item.percentage = ((item.amount / totalAmount) * 100).toFixed(2);
	});

	return chartData;
}
