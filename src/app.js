console.log("hello")
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
const windMeasurementFields = document.querySelectorAll('.measurement-wind')

const goToImagesTranscriptionBtn = document.querySelector('#go-to-img-transcription')
const hourlyImagesTranscript = document.querySelector('.hourly-images-transcript')

goToImagesTranscriptionBtn.addEventListener('click', () => {
	hourlyImagesTranscript.scrollIntoView({ block: "center", behavior: "smooth" })
})

function getOnlyTodayHours(array, compareTime) {
	return array.filter(item => item.dt_txt.split(" ")[0] === compareTime.split(" ").at(-1))
}

function fillCurrentWeatherFields(data) {
	const description = data['weather'][0]['description']
	const temp = data['main']['temp'].toFixed(1)
	const tempFeeling = data['main']['feels_like'].toFixed(1)
	const maxTemp = data['main']['temp_max'].toFixed(1)
	const minTemp = data['main']['temp_min'].toFixed(1)
	const clouds = data['clouds']['all']
	const wind = data['wind']['speed'].toFixed(1)
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
	windMeasurementFields.forEach(field => {
		field.innerHTML = 'm/s'
	})

	const todayWeatherIcon = document.querySelector('.today-weather-icon')
	let iconId = data['weather'][0]['icon'].slice(0, 2)
	todayWeatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${iconId}d.png`)
	todayWeatherIcon.setAttribute("alt", data['weather'][0]['description'])
}

function generateHourlyHTMLRow(array, currentIndex) {
	const temp = array[currentIndex]['main']['temp'].toFixed(1)
	const clouds = array[currentIndex]['clouds']['all']
	const wind = array[currentIndex]['wind']['speed'].toFixed(1)
	const humidity = array[currentIndex]['main']['humidity']
	const time = array[currentIndex]['dt_txt'].split(' ').at(-1).split(':')

	return `
		<div class="hourly-row-time">
			${time[0]}:${time[1]}
			<img class="hourly-row-icon">
		</div>
		<div class="hourly-row-indicator">
			${temp}
		</div>
		<div class="hourly-row-indicator">
			${clouds}
		</div>
		<div class="hourly-row-indicator">
			${wind}
		</div>
		<div class="hourly-row-indicator">
			${humidity}
		</div>
	`
}

function formatDate(date) {
	const month = (date.getMonth() + 1).toString().length > 1 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1).toString()
	const day = date.getDate().toString().length > 1 ? date.getDate() : '0' + date.getDate().toString()
	const weekday = date.toLocaleString(
		'en-US', { weekday: 'long' }
	)

	return `${weekday} ${date.getFullYear()}-${month}-${day}`
}

function fillHourlyWeatherData(data) {
	const currentDate = document.querySelector("#currentDate")
	const hourlyWeatherContainer = document.querySelector("#hourlyBody")
	hourlyWeatherContainer.innerHTML = ''

	let date = new Date()
	let requestedCityTimezone = data.city.timezone
	let localUTCOffset = date.getTimezoneOffset() / 60
	let requestedCityUTCOffset = requestedCityTimezone / 60 / 60
	let resultOffset = localUTCOffset + requestedCityUTCOffset

	let localCityDate = date
	let requestedCityDate = new Date(new Date().getTime() + resultOffset * 60 * 60 * 1000)
	const localDate = formatDate(localCityDate)
	const requestedDate = formatDate(requestedCityDate)

	currentDate.innerHTML = localDate

	let remainingHours = getOnlyTodayHours(data.list, requestedDate)

	for (let rowInd = 0; rowInd < remainingHours.length; rowInd++) {
		let houlryWeatherRow = document.createElement("div")
		houlryWeatherRow.classList.add("hourly-table-row")
		houlryWeatherRow.innerHTML = generateHourlyHTMLRow(remainingHours, rowInd)
		hourlyWeatherContainer.appendChild(houlryWeatherRow)
	}

	const hourlyIcons = document.querySelectorAll(".hourly-row-icon")
	hourlyIcons.forEach((el, ind) => {
		let iconId = remainingHours[ind]['weather'][0]['icon'].slice(0, 2)
		el.setAttribute("src", `https://openweathermap.org/img/wn/${iconId}d.png`)
		el.setAttribute("alt", remainingHours[ind]['weather'][0]['description'])
	})
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
		const CURRENT_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=${userCityInput.value}&appid=${API_KEY}&units=metric`

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

				document.querySelector('.city').classList.add('city-margin-on')
				fillCurrentWeatherFields(data)
			})
			.catch(error => {
				console.error(error)
			})

		const HOURLY_WEATHER_ULR = `https://api.openweathermap.org/data/2.5/forecast?q=${userCityInput.value}&appid=${API_KEY}&units=metric`

		getData(HOURLY_WEATHER_ULR)
			.then(data => {
				errorField.classList.remove('error-field-active')
				fillHourlyWeatherData(data)
			})
			.catch(error => {
				console.error(error)
			})
	}
})