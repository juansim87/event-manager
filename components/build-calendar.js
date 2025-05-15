import { getDatabase } from "/components/get-dates.js";

export const buildCalendar = async () => {

    let checkedPlays = [];

	const dateFilter = async (date) => {
		const data = await getDatabase();
		return data.flatMap((play) =>
			play.performances
				.filter((performance) => performance.start_time.startsWith(date))
				.map((performance) => ({
					title: play.title,
					start_time: performance.start_time.split("T")[1].slice(0, 5),
				}))
		);
	};

	const getAllStartDates = async () => {
		const data = await getDatabase();
		return data.flatMap((play) =>
			play.performances.map((p) => new Date(p.start_time))
		);
	};

	getAllStartDates();

	const getFormattedDate = async (type = "min") => {
		const dates = await getAllStartDates();
		const targetTime = Math[type](...dates.map((d) => d.getTime()));
		return new Date(targetTime).toISOString().split("T")[0];
	};

	const getMonth = async (type = "min") => {
		const dates = await getAllStartDates();
		const targetTime = Math[type](...dates.map((d) => d.getTime()));
		return new Date(targetTime).getMonth();
	};

	const monthsWithPlays = async () => {
		const earliest = await getMonth("min");
		const latest = await getMonth("max");
		return latest - earliest + 1;
	};

	//Array de días deshabilitados durante el período de festival

	const datesWithoutPlays = async () => {
		const allPlayDates = await getAllStartDates();

		const datesWithPlays = allPlayDates
			.map((element) => element.toISOString().split("T")[0])
			.filter((date, index, array) => array.indexOf(date) === index);

		const allDatesInRange = [];

		const minDateString = await getFormattedDate("min");
		const maxDateString = await getFormattedDate("max");

		const currentDate = new Date(minDateString);
		const lastDate = new Date(maxDateString);

		const index = new Date(currentDate);

		while (index <= lastDate) {
			const formatted = index.toISOString().split("T")[0];
			allDatesInRange.push(formatted);
			index.setDate(index.getDate() + 1);
		}

		const datesWithNoPlays = allDatesInRange.filter(
			(date) => !datesWithPlays.includes(date)
		);

		return datesWithNoPlays;
	};

	
	const { Calendar } = window.VanillaCalendarPro;

	const calendar = new Calendar("#calendar", {
		type: "multiple",
		displayDateMin: await getFormattedDate("min"),
		displayDateMax: await getFormattedDate("max"),
		disableDates: await datesWithoutPlays(),
		selectedMonth: await getMonth("min"),
		displayMonthsCount: await monthsWithPlays(),
		locale: "es-ES",
		async onClickDate(self) {
			const selectedDate = self.context.selectedDates[0];
			const filtered = await dateFilter(selectedDate);
            filtered.sort((a, b) => a.start_time.localeCompare(b.start_time));

			const contenedor = document.getElementById("date-plays");
			contenedor.innerHTML = "";

			filtered.forEach((play, index) => {
				const id = `${index}-${play.title}-${play.start_time}`;
				const input = document.createElement("input");
				input.type = "radio";
				input.id = id;
				input.value = play.start_time;
				input.name = `play-${selectedDate}`;
				input.setAttribute("data-date", selectedDate);

				const existingSelection = checkedPlays.find(
					(p) =>
						p.date === selectedDate &&
						p.play === play.title &&
						p.time === play.start_time
				);

				if (existingSelection) {
					input.checked = true;
				}

				input.addEventListener("click", () => {
					const date = input.dataset.date;

					checkedPlays = checkedPlays.filter((p) => p.date !== date);

					const checkedPlayInfo = {
						play: play.title,
						time: play.start_time,
						date: date,
					};

					checkedPlays.push(checkedPlayInfo);
					console.log(checkedPlays);
				});

				const label = document.createElement("label");
				label.htmlFor = id;
				label.textContent = `${play.start_time} || ${play.title}`;

				contenedor.appendChild(input);
				contenedor.appendChild(label);
				contenedor.appendChild(document.createElement("br"));
			});
		},
	});

	calendar.init();
};
