import { formatUnix } from "/helpers/formatUnix.js";

export const showOptions = (days) => {
	const performancesBox = document.getElementById("performances");
	const options = Object.entries(days);
	options.sort((a, b) => a[0].localeCompare(b[0]));
	options.forEach((date) => {
		const dayBox = document.createElement("div");
		dayBox.classList.add("day-box");
		const day = document.createElement("p");
		day.textContent = formatUnix(Date.parse(date) / 1000);

		const daySelection = document.createElement("select");
		daySelection.style.width = "100%";
		daySelection.classList.add("play-selection");
		const placeHolder = document.createElement("option");
		placeHolder.textContent = "Selecciona una obra";
		daySelection.append(placeHolder);

		date[1].forEach((play) => {
			const playOption = document.createElement("option");
			playOption.textContent = play;
			daySelection.append(playOption);
		});

		dayBox.append(day, daySelection);
		performancesBox.append(dayBox);
	});
};
