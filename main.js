const ctx = document.getElementbyid("myChart").getcontext("2d");

const labels = [
'2012',
'2013',
'2014',
'2015',
'2016',
'2017',
'2018',
'2019',
'2020',
];

const data = {
	labels,
	datasets: [{
		data: [211, 326, 165, 350, 420, 370, 500, 375, 415],
		label: "Minecrafty Sales",  
	},
	],
};

const config = {
	type: "line",
	data: data,
	options: {
		responsive: true,
	},

};

const myChart = new Chart(ctx,config)