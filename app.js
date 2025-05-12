import { getDates } from "./components/get-dates.js";
import { getPlays } from "./components/get-plays.js";
import { customeCalendar } from "./components/btn-generate.js";
import { resetCalendar } from "./components/btn-reset.js";




const selectorFecha = document.getElementById("fecha");
selectorFecha.addEventListener("change", (event) => {
	console.log(event.target.value);
	
});

getDates();

getPlays();

customeCalendar();

resetCalendar();


