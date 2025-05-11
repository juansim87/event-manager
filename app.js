import { getEvents } from "./components/get-events.js";
import { customeCalendar } from "./components/btn-generate.js";
import { resetCalendar } from "./components/btn-reset.js";


const selectorFecha = document.getElementById("fecha");
selectorFecha.addEventListener("change", (event) => {
	console.log(event.target.value);
	console.log(new Date(event.target.value).getTime());
});

getEvents();

customeCalendar();

resetCalendar();

