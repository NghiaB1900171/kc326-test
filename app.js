var ledImgON = '../picture/lighton.png'
var ledImgOFF = '../picture/lightoff.png'

var originClass = 'led-btn ' 
var ledClassON  = originClass + 'ledON'
var ledClassOFF = originClass + 'ledOFF'


var channelID = 1585273
var readAPIKey = 'ZYX2R6HBOVRFVM6U'
var writeAPIKey = '860G3MEUS4OSSWNK'

var updateLimit = 15000
var lastedWriteTime = 0
var dispatchData = { fieldName: [], fieldValue: [] }


function getNewValueInField(fieldName, fieldID, callback) {

	var url = 'https://api.thingspeak.com/channels/' + channelID + '/fields/' + fieldID + '/last.json?api_key=' + readAPIKey

	makeRequest('GET', url, function(rawData) {
		var data = JSON.parse(rawData)
		callback(parseInt(data[fieldName]))
	})


}

function controlsender(fieldName, value) {
	if (dispatchData.fieldName.includes(fieldName)) {
		dispatchData.fieldName.forEach((field, idx) => {
			if (field == fieldName) {
				dispatchData.fieldValue[idx] = value
			}
		})
	} else {
		dispatchData.fieldName.push(fieldName)
		dispatchData.fieldValue.push(value)
	}

	if (SendValueYesorNo()) {
		sendvaluetothingspeak()

	} else {
		const delay = 1000
		const elapsedTime = (Date.now() - lastedWriteTime) // the number of milliseconds elapsed since lastedWriteTime

		setTimeout(async () => sendvaluetothingspeak(), updateLimit + delay - elapsedTime)
	}


}

function sendvaluetothingspeak() {

	if ((SendValueYesorNo() == false)) { return }
	lastedWriteTime = Date.now()

	let url = 'https://api.thingspeak.com/update?api_key=' + writeAPIKey

	dispatchData.fieldName.forEach((field, idx) => {
		url += '&' + field + '=0' + dispatchData.fieldValue[idx]
	})

	makeRequest('GET', url, function(temp) {})

}

function SendValueYesorNo() {
	return (Date.now() - lastedWriteTime >= updateLimit)
}

for (const led of document.querySelectorAll('.led-btn')) led.addEventListener('click', function(event) {

	// event.target.src = event.target.src.includes(ledImgON) ? ledImgOFF : ledImgON
	
	//console.log(event.target.getAttribute("class"))
	
	event.target.setAttribute("class",   event.target.getAttribute("class").includes(ledClassON) ? ledClassOFF : ledClassON )
	
	document.querySelectorAll( ".led-control" ).forEach( function(led,idx) {
		if(event.target.id.includes(idx.toString())) {
		if(event.target.getAttribute("class").includes(ledClassON)) led.src= ledImgON
		else led.src= ledImgOFF
		}
		
	})
		
	
	
	//console.log(event.target.getAttribute("class"))

	let data = 0
	document.querySelectorAll('.led-btn').forEach(function(led, idx) {
		//data |= (led.src.includes(ledImgON) ? 0x1 : 0x0) << idx
		// console.log(led.getAttribute("class"))
		data |= (led.getAttribute("class").includes(ledClassON) ? 0x1 : 0x0) << idx
	})

	controlsender('field1', data)
})


function updateLedsField1() {
	getNewValueInField('field1', 1, function(data) {
		document.querySelectorAll('.led-btn').forEach((led, idx) => {
			// led.src = data & (0x1 << idx) ? ledImgON : ledImgOFF
			led.setAttribute("class", data & (0x1 << idx) ? ledClassON : ledClassOFF)
		})
	})
}
updateLedsField1()

function updateledField2() {
	getNewValueInField('field2', 2, function(data) {
		document.querySelector('.slider').value = data
		document.querySelector('.led-brightness').src = data <= 0 ? ledImgOFF : ledImgON
	})


}
updateledField2()

document.querySelector('.slider').addEventListener('change', function(event) {
	controlsender('field2', event.target.value, function(temp) {})
	document.querySelector('.led-brightness').src = event.target.value <= 0 ? ledImgOFF : ledImgON
})


for (const button of document.querySelectorAll('.led-ctrlall-btn')) button.addEventListener('click', function(event) {
	const isON = event.target.id == 'ON'

	controlsender('field1', isON ? 0xF : 0x0)
	//for (const led of document.querySelectorAll('.led-btn')) led.src = isON ? ledImgON : ledImgOFF
	for (const led of document.querySelectorAll('.led-control')) led.src=isON ?ledImgON :ledImgOFF
})




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
