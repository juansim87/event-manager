import { getDatabase, getDates } from "./components/get-dates.js";
import { getPlays } from "./components/get-plays.js";
import { customeCalendar } from "./components/btn-generate.js";
import { resetCalendar } from "./components/btn-reset.js";
// import { formatUnix } from "./helpers/formatUnix.js";

getDates();

getPlays();

customeCalendar();

resetCalendar();

const dateFilter = async (date) => {
	const data = await getDatabase();
	return data.filter((play) =>
		play.performances.some((performance) =>
			performance.start_time.startsWith(date)
		)
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

const generatePopUps = async () => {
	const data = await getDatabase();

	const popUpMap = data.reduce((acc, play) => {
		play.performances.forEach((performance) => {
			const date = performance.start_time.split("T")[0];
			const time = performance.start_time.split("T")[1].slice(0, 5);

			const playAndTime = `${play.title} - ${time}`;

			if (!acc[date]) {
				acc[date] = [];
			}

			acc[date].push(playAndTime);
		});

		return acc;
	}, {});


	console.log(popUpMap);

	return popUpMap;
};

generatePopUps();

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

	const contenedor = document.getElementById("obras-del-dia");
	contenedor.innerHTML = ""; // limpiar contenido anterior

	if (filtered.length === 0) {
		contenedor.innerHTML = "<p>No hay funciones este día</p>";
		return;
	}

	filtered.forEach((obra) => {
		const p = document.createElement("p");
		p.innerHTML = `<b>${obra.title}</b>`;
		contenedor.appendChild(p);
	});
}
});

calendar.init();
