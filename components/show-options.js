import { formatUnix } from "/helpers/formatUnix.js";

export const showOptions = (days) => {
    const performancesBox = document.getElementById("performances");

    const options = Object.entries(days);
    options.sort((a, b) => a[0].localeCompare(b[0]));

    options.forEach(([dateKey , plays]) => {
        const dayBox = document.createElement("div");
        dayBox.classList.add("day-box");

        const day = document.createElement("p");
        const startTime = Math.floor(Date.parse(plays[0].start_time) / 1000);
        day.textContent = formatUnix(startTime).split("||")[0].trim();

        const daySelection = document.createElement("select");
        daySelection.style.width = "100%";
        daySelection.classList.add("play-selection");
        const placeHolder = document.createElement("option");
        placeHolder.textContent = "Selecciona una obra";
        daySelection.append(placeHolder);

        plays.forEach((play) => {
            const playOption = document.createElement("option");
            
            const startTime = Math.floor(Date.parse(play.start_time) / 1000);
            const time = formatUnix(startTime).split("||")[1].trim()

            playOption.textContent = `${play.name} - ${time}`;
            daySelection.append(playOption);
        });

        dayBox.append(day, daySelection);
        performancesBox.append(dayBox);
    });
};