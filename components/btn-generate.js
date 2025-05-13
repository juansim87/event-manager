export const customeCalendar = () => {
	const calendarEntries = document.getElementById("calendar-entries");
	const generateButton = document.getElementById("btnGenerate");

	if (!generateButton){
		return;
	}

	generateButton.addEventListener("click", () => {
		calendarEntries.innerHTML = ``;

		document.querySelectorAll(".day-box").forEach((box) => {
			const daySelection = box.querySelector("p").textContent;
			const playSelection = box.querySelector(".play-selection").selectedOptions[0].textContent;
			
			if (playSelection !== "Selecciona una obra") {
				const calendarEntry = document.createElement("p");
				calendarEntry.classList.add("calendar-entry");
				calendarEntry.textContent = `${daySelection} || ${playSelection}`;
				calendarEntries.append(calendarEntry);
			}
		});
	});
};
