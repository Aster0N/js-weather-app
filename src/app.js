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


async function getData(url) {
	try {
		const response = await fetch(url)
		const data = await response.json()
		return data
	} catch (error) {
		console.error(error)
	}
}

showWeatherBtn.addEventListener('click', () => {
	if (userCityInput.value) {
		let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + userCityInput.value + '&appid=0b0e367f470fb02507e7aa3e527cb404';
		getData(url).then(data => {
			console.log(data)
		})
	}
})