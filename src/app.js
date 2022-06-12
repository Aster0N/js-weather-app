const scrollDownBtn = document.querySelector("#scrollDownBtn")

scrollDownBtn.addEventListener('click', e => {
	e.target.scrollIntoView({
		behavior: 'smooth'
	});
})

const userCityInput = document.querySelector('#userInput')
const cityField = document.querySelector('#cityName')
const weatherBriefDescription = document.querySelector('#weatherBriefDescription')
const tempField = document.querySelector('#tempField')
const feelingField = document.querySelector('#feelsLike')
const maxTempField = document.querySelector('#maxTemp')
const minTempField = document.querySelector('#minTemp')
const cloudsField = document.querySelector('#clouds')
const showWeatherBtn = document.querySelector('#showWeatherBtn')
const errorField = document.querySelector('#inputErrorField')
const weatherFields = document.querySelectorAll('.field')

const tempMeasurementFields = document.querySelectorAll('.measurement-temp')
const cloudsMeasurementFields = document.querySelector('.measurement-clouds')

function fillHTMLData(data) {
	const description = data['weather'][0]['description']
	const temp = data['main']['temp']
	const tempFeeling = data['main']['feels_like']
	const maxTemp = data['main']['temp_max']
	const minTemp = data['main']['temp_min']
	const clouds = data['clouds']['all']
	tempField.innerHTML = Math.floor(temp - 273.15)
	feelingField.innerHTML = Math.floor(tempFeeling - 273.15)
	maxTempField.innerHTML = Math.floor(maxTemp - 273.15)
	minTempField.innerHTML = Math.floor(minTemp - 273.15)
	cloudsField.innerHTML = clouds

	cityField.innerHTML = userCityInput.value
	weatherBriefDescription.innerHTML = description

	tempMeasurementFields.forEach(field => {
		field.innerHTML = '°C'
	})
	cloudsMeasurementFields.innerHTML = '%'
}

showWeatherBtn.addEventListener('click', () => {

	if (userCityInput.value) {
		let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + userCityInput.value + '&appid=0b0e367f470fb02507e7aa3e527cb404'

		fetch(url)
			.then(response => {
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
			})
			.then(data => {
				weatherFields.forEach(field => {
					field.classList.add('field-border-active')
					field.classList.remove('error-border')
				})
				errorField.classList.remove('error-field-active')

				document.querySelector('.city').style.margin = '20px 0 30px'
				fillHTMLData(data)
				console.log(data)
			})
			.catch(error => {
				console.error(error)
			})
	}
})