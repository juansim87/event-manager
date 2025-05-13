export const resetCalendar = () => {
	const resetButton = document.getElementById("btnReset");
	const calendarEntries = document.getElementById("calendar-entries");

	if (!resetButton) {
		return;
	}

	resetButton.addEventListener("click", () => {
		document.querySelectorAll(".day-box").forEach((box) => {
			const select = box.querySelector(".play-selection");
			select.value = "Selecciona una obra";
			calendarEntries.innerHTML = ``;
		});
	});
};
