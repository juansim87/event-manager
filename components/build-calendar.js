import { getDatabase } from "/components/get-dates.js";
import { formatUnix } from "../helpers/formatUnix.js";
import { generateSummary } from "./generate-summary.js";

export let checkedPlays = [];

export const buildCalendar = async () => {

	const dateFilter = async (date) => {
		const data = await getDatabase();

		return data.flatMap((play) =>
			play.performances
				.filter((performance) => performance.start_time.startsWith(date))
				.map((performance) => ({
					title: play.title,
					// date: performance.start_time.split("T")[0],
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

	const generatePopups = async () => {
	const data = await getDatabase();
	const popups = {};

	data.forEach((play) => {
		play.performances.forEach((performance) => {
			const date = performance.start_time.split("T")[0];
			const time = performance.start_time.split("T")[1].slice(0, 5);

			if (!popups[date]) {
				popups[date] = [];
			}

			popups[date].push({ time, title: play.title });
		});
	});

	const finalPopups = {};

	Object.keys(popups).forEach((date) => {
		const sorted = popups[date].sort((a, b) => a.time.localeCompare(b.time));

		const html = sorted
			.map(
				(f) =>
					`<b>${f.time} PM</b><br><p>${f.title}</p><br>`
			)
			.join("");

		finalPopups[date] = {
			html: `<div class = "popup">${html}</div>`,
		};
	});

	return finalPopups;
};

	const { Calendar } = window.VanillaCalendarPro;

	const calendar = new Calendar("#calendar", {
		type: "multiple",
		displayDateMin: await getFormattedDate("min"),
		displayDateMax: await getFormattedDate("max"),
		disableDates: await datesWithoutPlays(),
		selectedMonth: await getMonth("min"),
		displayMonthsCount: await monthsWithPlays(),
		popups: await generatePopups(),
		locale: "es-ES",
		async onClickDate(self) {
			const selectedDate = self.context.selectedDates[0];
			const filtered = await dateFilter(selectedDate);
			filtered.sort((a, b) => a.start_time.localeCompare(b.start_time));

			const contenedor = document.getElementById("date-plays");
			contenedor.innerHTML = "";

			const noneId = `none-${selectedDate}`;
			const noneInput = document.createElement("input");
			noneInput.type = "radio";
			noneInput.id = noneId;
			noneInput.name = `play-${selectedDate}`;
			noneInput.value = "none";
			noneInput.setAttribute("data-date", selectedDate);

			const existingSelection = checkedPlays.find(
				(p) => p.date === selectedDate
			);

			if (!existingSelection) {
				noneInput.checked = true;
			}

			noneInput.addEventListener("click", () => {
				const date = noneInput.dataset.date;

				checkedPlays = checkedPlays.filter((p) => p.date !== date);

				console.log(checkedPlays);
			});

			const noneLabel = document.createElement("label");
			noneLabel.htmlFor = noneId;
			noneLabel.textContent = "Ninguna";

			// Añádelo al DOM
			contenedor.appendChild(noneInput);
			contenedor.appendChild(noneLabel);
			contenedor.appendChild(document.createElement("br"));

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
						title: play.title,
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

	/**
	 *
	 * @returns Resumen de las obras seleccionadas en el calendario
	 */

	generateSummary(checkedPlays);

	const resetSelections = () => {
		const resetButton = document.getElementById("btnReset");
		const calendarEntries = document.getElementById("calendar-entries");

		if (!resetButton) {
			return;
		}

		resetButton.addEventListener("click", () => {
			calendarEntries.classList.remove("summary-box");
			calendarEntries.innerHTML = ``;

			const noneRadios = document.querySelectorAll(
				"input[type = 'radio'][value = 'none]"
			);
			noneRadios.forEach((radio) => {
				radio.checked = true;
			});

			checkedPlays= [];
		});
	};

	resetSelections();
};
