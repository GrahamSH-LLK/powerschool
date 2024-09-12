import arts from "./assets/arts.png";
import foreignlang from "./assets/foreignlang.png";
import languagearts from "./assets/languagearts.png";
import math from "./assets/math.png";
import other from "./assets/other.png";
import pe from "./assets/pe.png";
import science from "./assets/science.png";
import socstudies from "./assets/socstudies.png";
import studyhall from "./assets/studyhall.png";
import { TinyColor } from "@ctrl/tinycolor";
export const subjectIcons = {
  arts,
  foreignlang,
  languagearts,
  math,
  other,
  pe,
  science,
  socstudies,
  studyhall,
};

export function addStyle(css = "") {
  let target = document.head || document.body;
  let style = document.createElement("style");

  style.type = "text/css";
  style.innerHTML = css;
  target.append(style);
}

export let subjects = [
  "math",
  "science",
  "languagearts",
  "socstudies",
  "foreignlang",
  "arts",
  "pe",
  "studyhall",
  "other",
];
export let colors = [
  "#02817F",
  "#C15103",
  "#6B3B85",
  "#027BBA",
  "#C21572",
  "#C21572",
  "#C41230",
  "#0F1187",
  "#627833",
];
export const gradients = subjects.map((subject, i) => {
  const color = colors[i];
  const gradient = `linear-gradient(135deg, ${new TinyColor(color)?.darken(
    15
  )} 0%, ${new TinyColor(color)?.brighten(5)} 50%,  ${new TinyColor(color)?.brighten(
    10
  )} 100%)`;
  return gradient;
});

let keywords = {
  algebra: "math",
  geometry: "math",
  calc: "math",
  trig: "math",
  art: "arts",
  wellness: "pe",
  health: "pe",
  //ice: "studyhall",
  history: "socstudies",
  english: "languagearts",
  language: "languagearts",
  spanish: "foreignlang",
  french: "foreignlang",
  latin: "foreignlang",
  biology: "science",
  chemistry: "science",
  physics: "science",
  environmental: "science",
  computer: "math",
};
export const keywordToSubject = (keyword) => {
  for (let [key, value] of Object.entries(keywords)) {
    if (keyword.toLowerCase().includes(key)) {
      return value;
    }
  }
  return "other";
};

export const injectIconStyles = () => {
  for (let i = 0; i < subjects.length; i++) {
    addStyle(`
        [data-subject="${subjects[i]}"] {
            background-image: url(${subjectIcons[subjects[i]]}), ${gradients[i]};
        }
        `);
  }
};
