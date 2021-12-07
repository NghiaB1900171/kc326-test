var Channell = 1585273
var Keydoc = 'ZYX2R6HBOVRFVM6U'
var Keyghi = '860G3MEUS4OSSWNK'

var Point = 20
var Timeup = 15000



/* tạo chart */
var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
	type: 'line',
	data: {
		labels: [],
		datasets: [{
			label: 'du lieu bien tro',
			data: [],
			borderColor: 'red',
			borderWidth: 1,
			showLine: true
		}]
	},
	options: {
		maintainAspectRatio: false,
		responsive: true,
	},
})



function updateDate(length) {



	ReadNoNull('field2', 2, function(rawData) {



		if (rawData.length < length) {

			if (arrayCompare(chart.data.datasets[0].data, rawData) == false) {
				chart.data.labels.length = 0
				chart.data.datasets[0].data.length = 0

				chart.data.labels.push(...Array.from(Array(rawData.length).keys()))
				chart.data.datasets[0].data.push(...rawData)
			}
		} else {
			let newXArray = rawData.slice(rawData.length - length)

			if (arrayCompare(chart.data.datasets[0].data, newXArray) == false) {

				chart.data.labels.length = 0
				chart.data.datasets[0].data.length = 0

				chart.data.labels.push(...Array.from(Array(length).keys()))
				chart.data.datasets[0].data.push(...newXArray)
			}
		}

		chart.update()

	})

}

updateDate(Point)

setInterval(() => {
	updateDate(Point)
}, Timeup)


function arrayCompare(arr1, arr2) {

	if (arr1.length != arr2.length) { return false }

	let result = true

	arr1.forEach((arr1Element, idx) => {
		if (arr1Element != arr2[idx]) {
			result = false
		}
	})
	return result
}


function ReadNoNull(fieldName, fieldID, callback) {

	let url = 'https://api.thingspeak.com/channels/' + Channell + '/fields/' + fieldID + '/last.json?api_key=' + Keydoc

	makeRequest('GET', url, function(lastedJson) {
		const lastedEntryID = JSON.parse(lastedJson)['entry_id']

		url = 'https://api.thingspeak.com/channels/' + Channell + '/fields/' + fieldID + '.json?api_key=' + Keydoc + '&results=' + lastedEntryID

		makeRequest('GET', url, function(fieldJson) {
			const rawData = JSON.parse(fieldJson)['feeds']

			const data = []
			for (const rawdata of rawData) {
				if (rawdata[fieldName] != null)
					data.push(parseInt(rawdata[fieldName]))
			}

			callback(data)

		})

	})

}

function makeRequest(method, url, callback) {
	let xhr = new XMLHttpRequest()
	xhr.open(method, url)
	xhr.onload = function() {
		if (this.status >= 200 && this.status < 300) {
			callback(xhr.responseText)
		}
	}
	xhr.send()
}
