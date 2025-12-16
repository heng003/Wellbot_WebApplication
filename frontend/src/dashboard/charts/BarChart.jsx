import React, { Component } from 'react';
import Chart from 'react-apexcharts';

class BarChart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			height: this.props.height || "100%",
			chartData: [],
			chartOptions: {},
		};
	}

	componentDidMount() {
		this.setState({
			chartData: this.props.chartData,
			chartOptions: this.props.chartOptions,
		});
	}

	render() {
		return (
			<Chart
				options={this.state.chartOptions}
				series={this.state.chartData}
				type="bar"
				width="100%"
				height={this.state.height}
			/>
		);
	}
}

export default BarChart;
