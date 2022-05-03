const scrollDownBtn = document.querySelector("#scrollDownBtn");

scrollDownBtn.addEventListener('click', e => {
	e.target.scrollIntoView({
		behavior: 'smooth'
	});
})
