// Arrays con nombres en español (capitalizados)

export const formatUnix = (ts) => {
	const weekdays = [
		"Domingo",
		"Lunes",
		"Martes",
		"Miércoles",
		"Jueves",
		"Viernes",
		"Sábado",
	];
	const months = [
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Junio",
		"Julio",
		"Agosto",
		"Septiembre",
		"Octubre",
		"Noviembre",
		"Diciembre",
	];

	const date = new Date(ts * 1000); // crear Date a partir de segundos
	const weekday = weekdays[date.getDay()]; // 0–6 => Domingo–Sábado
	const day = date.getDate(); // 1–31
	const month = months[date.getMonth()]; // 0–11 => Enero–Diciembre
	const year = date.getFullYear(); // e.g. 2025
	const hours = String(date.getHours()).padStart(2, "0"); // 00–23
	const minutes = String(date.getMinutes()).padStart(2, "0"); // 00–59

	return `${weekday} ${day} de ${month} ${year} a las ${hours}:${minutes}`;
};

// Ejemplo:
const ejemploTs = Date.parse("2025-08-02T10:50:00+02:00") / 1000;
console.log(formatUnix(ejemploTs));
// → "Sábado 2 de Agosto 2025 a las 10:50"
