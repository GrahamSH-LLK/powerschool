import { addStyle, injectIconStyles } from "./utils";
import home from "./pages/home";
import score from "./pages/score";
injectIconStyles();
const page = window.location.href.includes("home.html")
  ? "home"
  : window.location.href.includes("scores.html")
  ? "scores"
  : "other";
switch (page) {
  case "home":
    home();
    break;
  case "scores":
    score();
    break;
  default:
    break;
}
