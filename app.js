import { getDatabase, getDates } from "./components/get-dates.js";
import { getPlays } from "./components/get-plays.js";
import { customeCalendar } from "./components/btn-generate.js";
import { resetCalendar } from "./components/btn-reset.js";

getDates();

getPlays();

customeCalendar();

resetCalendar();

const filtrarPorFecha = async (fecha) => {
const data = await getDatabase();
console.log(data);
  return data.filter((obra) =>
    obra.performances.some((funcion) => funcion.start_time.startsWith(fecha))
  
);
};

const { Calendar } = window.VanillaCalendarPro;

const calendar = new Calendar("#calendar", {
	locale: "es-ES",
	onClickDate(self) {
	const selectedDate = self.context.selectedDates[0];
    const filtered = filtrarPorFecha(selectedDate);

    console.log(filtered);
    
	},
});


calendar.init();
