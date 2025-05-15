import { getDates } from "./components/get-dates.js";
import { getPlays } from "./components/get-plays.js";
import { customeCalendar } from "./components/btn-generate.js";
import { resetCalendar } from "./components/btn-reset.js";
import { buildCalendar } from "./components/build-calendar.js";
// import { formatUnix } from "./helpers/formatUnix.js";

getDates();

getPlays();

customeCalendar();

resetCalendar();

buildCalendar();
