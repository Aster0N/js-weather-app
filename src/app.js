import API_KEY from './apiKey.js'

const userCityInput = document.querySelector('#userInput')
const cityField = document.querySelector('#cityName')
const weatherBriefDescription = document.querySelector('#weatherBriefDescription')
const tempField = document.querySelector('#tempField')
const feelingField = document.querySelector('#feelsLike')
const maxTempField = document.querySelector('#maxTemp')
const minTempField = document.querySelector('#minTemp')
const cloudsField = document.querySelector('#clouds')
const windField = document.querySelector("#wind")
const humidityField = document.querySelector("#humidity")

const showWeatherBtn = document.querySelector('#showWeatherBtn')
const errorField = document.querySelector('#inputErrorField')
const weatherFields = document.querySelectorAll('.field')
const fieldsWrapper = document.querySelector(".weather-data-fields")

const tempMeasurementFields = document.querySelectorAll('.measurement-temp')
const percentMeasurementFields = document.querySelectorAll('.measurement-percent')
const windMeasurementFields = document.querySelector('.measurement-wind')

function fillCurrentWeatherFields(data) {
	const description = data['weather'][0]['description']
	const temp = data['main']['temp']
	const tempFeeling = data['main']['feels_like']
	const maxTemp = data['main']['temp_max']
	const minTemp = data['main']['temp_min']
	const clouds = data['clouds']['all']
	const wind = data['wind']['speed']
	const humidity = data['main']['humidity']

	tempField.innerHTML = temp
	feelingField.innerHTML = tempFeeling
	maxTempField.innerHTML = maxTemp
	minTempField.innerHTML = minTemp
	cloudsField.innerHTML = clouds
	windField.innerHTML = wind
	humidityField.innerHTML = humidity

	cityField.innerHTML = userCityInput.value
	weatherBriefDescription.innerHTML = description

	tempMeasurementFields.forEach(field => {
		field.innerHTML = '°C'
	})
	percentMeasurementFields.forEach(field => {
		field.innerHTML = '%'
	})
	windMeasurementFields.innerHTML = 'm/s'
}

function fillHourlyWeatherData(data) {
	const currentDate = document.querySelector("#currentDate")

	let date = new Date()
	let currentMonth = (date.getMonth() + 1).toString().length > 1 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1).toString()
	let currentDay = date.getDate().toString().length > 1 ? date.getDate() : '0' + date.getDate().toString()
	let weekday = date.toLocaleString(
		'en-US', { weekday: 'long' }
	);
	let todayDate = `${weekday} ${date.getFullYear()}-${currentMonth}-${currentDay}`

	currentDate.innerHTML = todayDate
}

async function getData(url) {
	const response = await fetch(url)
	if (response.ok) {
		return response.json()
	}
	if (response.status == 404) {
		weatherFields.forEach(field => {
			field.classList.remove('field-border-active')
			field.classList.add('error-border')
		})
		errorField.classList.add('error-field-active')
		errorField.innerHTML = 'The name of the city is entered incorrectly'
	}
	throw new Error('Something went wrong')
}

showWeatherBtn.addEventListener('click', () => {
	if (userCityInput.value) {
		let CURRENT_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=${userCityInput.value}&appid=${API_KEY}&units=metric`

		getData(CURRENT_WEATHER_URL)
			.then(data => {
				weatherFields.forEach(field => {
					field.classList.add('field-border-active')
					field.classList.remove('error-border')
				})
				errorField.classList.remove('error-field-active')
				if (fieldsWrapper.classList.contains("data-fields-closed")) {
					fieldsWrapper.classList.remove("data-fields-closed")
					fieldsWrapper.classList.add("data-fields-opened")
				}

				document.querySelector('.city').style.margin = '30px 0 20px 50px'
				fillCurrentWeatherFields(data)
				console.log(data)
			})
			.catch(error => {
				console.error(error)
			})

		let HOURLY_WEATHER_ULR = `https://api.openweathermap.org/data/2.5/forecast?q=${userCityInput.value}&appid=${API_KEY}&units=metric`

		getData(HOURLY_WEATHER_ULR)
			.then(data => {
				errorField.classList.remove('error-field-active')
				fillHourlyWeatherData(data)
				console.log('hourly data')
				console.log(data)
			})
			.catch(error => {
				console.error(error)
			})
	}
})