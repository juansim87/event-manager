import { formatUnix } from "/helpers/formatUnix.js";

export const getEvents = async () => {
	try {
		const response = await fetch("/helpers/upm-theater-festival-2025.json");
		const festivalData = await response.json();
		console.log(festivalData);

		const performancesBox = document.getElementById("performances");

		const availableDays = festivalData.reduce((acc, play) => {
			play.performances.forEach(({ start_time }) => {
				const date = formatUnix(Date.parse(start_time) / 1000);
				if (!acc[date]) {
					acc[date] = [];
				}
				if (!acc[date].includes(play.name)) {
					acc[date].push(play.name);
				}
			});
			return acc;
		}, {});

		const showOptions = () => {
			const options = Object.entries(availableDays);
			options.forEach((date) => {
				const dayBox = document.createElement("div");
				dayBox.classList.add("day-box");
				const day = document.createElement("p");
				day.textContent = date[0];

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

		showOptions();
	} catch (error) {
		console.log("Error durante la petición de datos", error.message);
	}
};
