import { checkedPlays } from "./build-calendar.js";
import { formatUnix } from "../helpers/formatUnix.js";

export const generateSummary = () => {
	const btnGenerate = document.getElementById("btnGenerate");
	const calendarEntries = document.getElementById("calendar-entries");

	if (!btnGenerate) {
		return;
	}

	btnGenerate.addEventListener("click", () => {
		calendarEntries.innerHTML = ``;

		if (checkedPlays.length === 0) {
			const noneAlert = document.createElement("p");
			noneAlert.textContent = "No hay obras seleccionadas";

			calendarEntries.append(noneAlert);
			console.log(noneAlert);
			return;
		}

		calendarEntries.classList.add("summary-box");

		const ordered = [...checkedPlays].sort((a, b) => {
			// if (a.date === b.date) {
			// 	return a.time.localeCompare(b.time);
			// }
			return a.date.localeCompare(b.date);
		});

		ordered.forEach((selection) => {
			const selectedPlayInfo = document.createElement("p");
			selectedPlayInfo.textContent = `${formatUnix(
				Date.parse(selection.date) / 1000
			)} - ${selection.time} - ${selection.title}`;
			calendarEntries.append(selectedPlayInfo);
		});
	});
};
