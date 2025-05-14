import { showOptions } from "./show-dates.js";

export const getPlays = async () => {
	try {
		const response = await fetch("/helpers/upm-theater-festival-2025.json");
		const festivalData = await response.json();
		// console.log(festivalData);

		const availablePlays = festivalData.reduce((acc, entry) => {
			const { title, performances } = entry;

			if (!acc[title]) {
				acc[title] = [];
			}

			performances.forEach(({ start_time }) => {
				const [day, time] = start_time.split("T");
				acc[title].push({ day, time });
			});

			

			return acc;
		}, []);

		
        console.log(availablePlays);
        
	} catch (error) {
		console.log("Error durante la petición de datos", error.message);
	}
};
