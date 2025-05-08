export const showOptions = (days) => {
    const performancesBox = document.getElementById("performances");
    const options = Object.entries(days);
    options.forEach((date) => {
        const dayBox = document.createElement("div");
        dayBox.classList.add("day-box");
        const day = document.createElement("p");
        day.textContent = date[0];

        const daySelection = document.createElement("select");
        daySelection.style.width = "100%";
        daySelection.classList.add("play-selection");
        const placeHolder = document.createElement("option");
        placeHolder.textContent = "Selecciona una obra";
        daySelection.append(placeHolder);

        date[1].forEach((play) => {
            const playOption = document.createElement("option");
            playOption.textContent = play;
            daySelection.append(playOption);
        });

        dayBox.append(day, daySelection);
        performancesBox.append(dayBox);
    });
};