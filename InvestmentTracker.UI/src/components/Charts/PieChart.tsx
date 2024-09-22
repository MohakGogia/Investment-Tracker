import { Chart } from 'primereact/chart';
import { useState, useEffect } from 'react';
import { InvestmentType } from '../../core/enums';
import { Investment } from '../../models/investment';
import { CHART_COLORS } from '../../core/color-coding';
import { ChartData } from '../../models/chart-models';
import { formatName } from '../../utility/utils';

export default function PieChart({
	investmentsData,
}: {
	investmentsData: Investment[];
}) {
	const [chartData, setChartData] = useState({});
	const [chartOptions, setChartOptions] = useState({});

	useEffect(() => {
		const pieChartData: ChartData[] = preparePieChartData(investmentsData);
		const labels: string[] = [];
		const dataObj: number[] = [];
		const bgColors: string[] = [];
		const hoverColors: string[] = [];

		pieChartData.forEach((element, index) => {
			labels.push(`${formatName(element.name)} (${element.percentage}%)`);
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
			plugins: {
				title: {
					display: true,
					text: 'Investment distribution across different asset classes',
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
				<Chart type='pie' data={chartData} options={chartOptions} />
			)}
		</div>
	);
}

function preparePieChartData(data: Investment[]): ChartData[] {
	// Group records by InvestmentType
	const groupedData: { [key: number]: Investment[] } = {};
	data.forEach((record) => {
		const type = record.type;
		if (!groupedData[type]) {
			groupedData[type] = [];
		}
		groupedData[type].push(record);
	});

	// Calculate total amount for each group
	const chartData: ChartData[] = [];
	let totalAmount = 0;
	for (const type in groupedData) {
		if (Object.prototype.hasOwnProperty.call(groupedData, type)) {
			const groupAmount = groupedData[type].reduce(
				(sum, record) => sum + record.amount,
				0
			);
			chartData.push({
				name: InvestmentType[type],
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
