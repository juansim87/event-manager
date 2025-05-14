import { getDatabase, getDates } from "./components/get-dates.js";
import { getPlays } from "./components/get-plays.js";
import { customeCalendar } from "./components/btn-generate.js";
import { resetCalendar } from "./components/btn-reset.js";
import { formatUnix } from "./helpers/formatUnix.js";

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

const datesWithoutPlays = async () => {
	const formatDate = await getAllStartDates();

	const datesWithPlays = formatDate
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

	const datesWithNoPlays = allDatesInRange.filter((date) => !datesWithPlays.includes(date));

	

	return datesWithNoPlays;
};

datesWithoutPlays();

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
		const footer = document.getElementById("footer");
		footer.textContent= `${filtered}`;
	},
	
});

calendar.init();
