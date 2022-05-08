const scrollDownBtn = document.querySelector("#scrollDownBtn");

scrollDownBtn.addEventListener('click', e => {
	e.target.scrollIntoView({
		behavior: 'smooth'
	});
})

const userCityInput = document.querySelector('#userInput')
const tempField = document.querySelector('#temp_field')
const feelingField = document.querySelector('#feels_like')
const maxTempField = document.querySelector('#max_temp')
const minTempField = document.querySelector('#min_temp')
const cloudsField = document.querySelector('#clouds')
const showWeatherBtn = document.querySelector('#showWeatherBtn')