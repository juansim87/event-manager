
import { showOptions } from "./show-options.js";

export const getEvents = async () => {
	try {
		const response = await fetch("/helpers/upm-theater-festival-2025.json");
		const festivalData = await response.json();
		console.log(festivalData);

		
		const availableDays = festivalData.reduce((acc, play) => {
			play.performances.forEach(({ start_time }) => {
				const isoDate = start_time.split("T")[0]; 
				if (!acc[isoDate]) {
					acc[isoDate] = [];
				}
				if (!acc[isoDate].includes(play.name)) {
					acc[isoDate].push(play.name);
				}
			});
			return acc;
		}, {});
		

		showOptions(availableDays);


	} catch (error) {
		console.log("Error durante la petición de datos", error.message);
	}
};
