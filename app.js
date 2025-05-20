import { getDates } from "./components/get-dates.js";
import { getPlays } from "./components/get-plays.js";


import { buildCalendar } from "./components/build-calendar.js";
// import { formatUnix } from "./helpers/formatUnix.js";

getDates();

getPlays();

buildCalendar();
