import { getDatabase, getDates } from "./components/get-dates.js";
import { getPlays } from "./components/get-plays.js";
import { customeCalendar } from "./components/btn-generate.js";
import { resetCalendar } from "./components/btn-reset.js";

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

//Primer día con obra

const firstDate = async () => {
	const data = await getDatabase();

	const everyDate = data
		.flatMap((play) => play.performances.map((p) => p.start_time))
		.map((date) => new Date(date));

	const earliestDate = new Date(Math.min(...everyDate.map((d) => d.getTime())));

	const date = new Date(earliestDate);
	const shortFormat = date.toISOString().split("T")[0];

	return shortFormat;
};

//Última día con obra
const lastDate = async () => {
	const data = await getDatabase();

	const everyDate = data
		.flatMap((play) => play.performances.map((p) => p.start_time))
		.map((date) => new Date(date));

	const earliestDate = new Date(Math.max(...everyDate.map((d) => d.getTime())));

	const date = new Date(earliestDate);
	const shortFormat = date.toISOString().split("T")[0];

	return shortFormat;
};

///Primer mes con obras

const firstMonth = async () => {
	const data = await getDatabase();

	const everyDate = data
		.flatMap((play) => play.performances.map((p) => p.start_time))
		.map((date) => new Date(date));

	const earliestMonth = new Date(
		Math.min(...everyDate.map((d) => d.getTime()))
	);
	return earliestMonth.getMonth();
};

///Último mes con obras

const lastMonth = async () => {
	const data = await getDatabase();

	const everyDate = data
		.flatMap((play) => play.performances.map((p) => p.start_time))
		.map((fecha) => new Date(fecha));

	const latestMonth = new Date(
		Math.max(...everyDate.map((date) => date.getTime()))
	);

	return latestMonth.getMonth();
};

//Meses a mostrar

const monthsWithPlays = async () => {
	const earliestMonth = await firstMonth();
	const latestMonth = await lastMonth();
	const calculateMonths = latestMonth - earliestMonth + 1;
	return calculateMonths;
};


///Array de fechas para deshabilitar



const { Calendar } = window.VanillaCalendarPro;

const calendar = new Calendar("#calendar", {
	type: "multiple",
	displayDateMin: await firstDate(),
	displayDateMax: await lastDate(),
	selectedMonth: await firstMonth(),
	displayMonthsCount: await monthsWithPlays(),
	locale: "es-ES",
	async onClickDate(self) {
		const selectedDate = self.context.selectedDates[0];
		const filtered = await dateFilter(selectedDate);
		console.log(filtered);
	}
});

calendar.init();
