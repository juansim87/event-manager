import { showOptions } from "./show-options.js";

export const getDates = async () => {
	try {
		const response = await fetch("/helpers/upm-theater-festival-2025.json");
		const festivalData = await response.json();
		console.log(festivalData);

		const availableDays = festivalData.reduce((acc, entry) => {
			entry.performances.forEach(({ start_time }) => {
				const dateKey = start_time.split("T")[0];
				if (!acc[dateKey]) {
					acc[dateKey] = [];
				}
				acc[dateKey].push({
					title: entry.title,
					start_time: start_time,
				});
			});

			return acc;
		}, {});

		showOptions(availableDays);
	} catch (error) {
		console.log("Error durante la petición de datos", error.message);
	}
};
