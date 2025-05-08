import { formatUnix } from "/helpers/formatUnix.js";
import { showOptions } from "./show-options.js";

export const getEvents = async () => {
	try {
		const response = await fetch("/helpers/upm-theater-festival-2025.json");
		const festivalData = await response.json();
		console.log(festivalData);

		
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
		

		showOptions(availableDays);

		
	} catch (error) {
		console.log("Error durante la petición de datos", error.message);
	}
};
