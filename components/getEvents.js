import { formatUnix } from "/helpers/formatUnix.js";

export const getEvents = async () => {
	try {
		const response = await fetch("/helpers/upm-theater-festival-2025.json");
		const data = await response.json();
		console.log(data);

        const performancesBox = document.getElementById("performances");

		// PARA PINTAR OPCIONES DE VISIONADO DE OBRAS
		// data.forEach((element) => {
		// 	element.performances.forEach((date) => {
		// 		console.log(
		// 			element.name,
		// 			formatUnix(Date.parse(date.start_time) / 1000)
		// 		);
		// 	});

			//         const play = document.createElement("div");

			//         const playName = document.createElement("h2");
			//         playName.textContent = element.name;

			//         const playOptions = document.createElement("div");

			//         element.performances.forEach((option) => {
			//             const playDates = document.createElement("p");
			//             playDates.textContent = formatUnix(
			//                 Date.parse(option.start_time) / 1000
			//             );
			//             playOptions.append(playDates);
			//         });

			//         play.append(playName, playOptions);

			//         performancesBox.append(play);
		// });

		const availableDays = data.reduce((acc, obra) => {
			obra.performances.forEach(({ start_time }) => {
				const date = start_time.split("T")[0];
				if (!acc[date]) {
					acc[date] = [];
				}
				if (!acc[date].includes(obra.name)) {
					acc[date].push(obra.name);
				}
			});
			return acc;
		}, {});

        const showOptions = () => {

            const options = Object.entries(availableDays);
            console.log("Opciones por día", options);
            Object.entries(availableDays).forEach((date)=> {
                const dayBox = document.createElement("div");
                dayBox.classList.add("day-box");

                const day = document.createElement("p");
                day.textContent = date[0];
                
                const daySelection = document.createElement("select");

                date[1].forEach ((play)=> {
                    const playOption = document.createElement("option");
                    playOption.textContent = play;
                    
                    daySelection.append(playOption)
                })
                





                dayBox.append(day, daySelection);
                performancesBox.append(dayBox);

            })
        };

        showOptions();

		console.log(availableDays);
	} catch (error) {
		console.log("Error durante la petición de datos", error.message);
	}
};
