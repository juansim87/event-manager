import { getEvents } from "./components/getEvents.js";

// Convertir fecha a UNIX
const selectorFecha = document.getElementById("fecha");
selectorFecha.addEventListener("change", (event) => {
	console.log(event.target.value);
	console.log(new Date(event.target.value).getTime());
});

getEvents();

generateCalendar();
