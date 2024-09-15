import { addStyle, keywordToSubject } from "../utils";
import { format } from "date-fns";
import styles from "./score.css";
import tableStyles from "./table.css";
const gradeOverrides = {};
const numberToColor = (num: number | string) => {
  if (typeof num === "string") {
    num = parseInt(num);
  }
  const colors = [
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
  return colors[num];
};
export default async function () {
  if (!document) {
    return;
  }
  addStyle(styles);
  addStyle(tableStyles);
  const sectionId = document
    .querySelector("[data-sectionid]")
    ?.getAttribute("data-sectionid");
  const ngData = document
    .querySelector("[data-ng-init]")
    ?.getAttribute("data-ng-init")
    ?.split(";");
  const studentId = ngData?.[0]
    .trim()
    .split(" = ")[1]
    .replaceAll("'", "")
    .replace("001", "");
  let begDate;
  let endDate;
  let code = new URLSearchParams(window.location.search).get("fg");
  try {
    begDate = new Date(ngData[1].trim().split(" = ")[1].replaceAll("'", ""))
      ?.toISOString()
      .split("T")[0];
    endDate = new Date(ngData[2].trim().split(" = ")[1].replaceAll("'", ""))
      ?.toISOString()
      .split("T")[0];
  } catch (e) {
    console.error(e);
  }
  const getAssignmentData = async () => {
    const res = await fetch(
      `${window.location.origin}/ws/xte/assignment/lookup?_=${Date.now()}`, // i think it's a cache buster
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          section_ids: [sectionId],
          student_ids: [studentId],
          start_date: begDate,
          end_date: endDate,
          store_codes: [code],
        }),
        method: "POST",
        credentials: "include",
      }
    );
    return await res.json();
  };

  //document.addEventListener("DOMContentLoaded", async function () {
  const assignmentData = await getAssignmentData();

  const classInfoContainer = document.querySelector(
    ".linkDescList > tbody > tr:nth-child(2)"
  );
  const className =
    classInfoContainer.querySelector("td:nth-child(1)").textContent;
  const teacher =
    classInfoContainer.querySelector("td:nth-child(2)").textContent;
  const expression =
    classInfoContainer.querySelector("td:nth-child(3)").textContent;
  const term = classInfoContainer.querySelector("td:nth-child(4)").textContent;
  const gradeContainer = classInfoContainer.querySelector("td:nth-child(5)");
  const grade = {
    letterGrade: gradeContainer.childNodes[0].textContent.trim(),

    number: gradeContainer.childNodes[2].textContent.trim(),
  };
  const comment = document.querySelector(".comment").textContent;
  const sectionDescription = document.querySelector(
    ".comment:nth-of-type(2)"
  ).textContent;
  const classContainer = Object.assign(document.createElement("div"), {
    className: "class-container",
  });

  const header = Object.assign(document.createElement("div"), {
    className: "class-header",
  });

  const headerTop = Object.assign(document.createElement("div"), {
    className: "class-header-top",
  });
  headerTop.setAttribute("data-subject", keywordToSubject(className));
  headerTop.append(
    Object.assign(document.createElement("div"), {
      className: "class-header-top-title",
      textContent: "",
    })
  );
  const headerBottom = Object.assign(document.createElement("div"), {
    className: "class-header-bottom",
  });
  headerBottom.appendChild(
    Object.assign(document.createElement("div"), {
      textContent: teacher,
      className: "class-teacher",
    })
  );
  headerBottom.appendChild(
    Object.assign(document.createElement("div"), {
      textContent: expression,
      className: "class-expression",
    })
  );

  const infoContainer = Object.assign(document.createElement("div"), {
    className: "class-info-container",
  });
  infoContainer.appendChild(
    Object.assign(document.createElement("div"), {
      textContent: className,
      className: "class-header-top-title ",
    })
  );
  const percent = getGrade(assignmentData).toFixed(0);

  infoContainer.appendChild(
    Object.assign(document.createElement("div"), {
      textContent: grade.letterGrade + " | " + grade.number,
      className: "class-lettergrade",
    })
  );
  headerBottom.appendChild(
    Object.assign(document.createElement("div"), {
      textContent:
        percent + "%" !== grade.number
          ? "Grade calculated by category weight"
          : "Grade calculated by total points",
      className: "class-percent",
    })
  );

  headerTop.appendChild(infoContainer);
  header.appendChild(headerTop);
  header.appendChild(headerBottom);
  classContainer.appendChild(header);
  const tabsEl = document.querySelector(".tabs");
  console.log("huhh");
  let allCategories: string[] = assignmentData.map(
    (assignment) =>
      assignment._assignmentsections[0]._assignmentcategoryassociations[0]
        ._teachercategory.name
  );
  let uniqueCategories: Set<string> = new Set(allCategories);

  const targetGrade = parseInt(grade.number.replace("%", ""));

  const categoryGrades = [...uniqueCategories].map((category) => {
    let filteredData = assignmentData.filter(
      (assignment) =>
        assignment._assignmentsections[0]._assignmentcategoryassociations[0]
          ._teachercategory.name === category
    );
    return {
      category: category,
      percent: getGrade(filteredData),
      weight: 1 / uniqueCategories.size,
    };
  });
  const actualGrade = getGrade(assignmentData);
  const lower = actualGrade < targetGrade;
  const categoryGradesSorted = categoryGrades.sort((a, b) =>
    lower ? a.percent - b.percent : b.percent - a.percent
  );

  for (let [i, category] of categoryGradesSorted.entries()) {
    category.weight = (categoryGradesSorted.length - i + 1) * 5;
    console.log(category);
  }

  tabsEl?.insertAdjacentElement("afterend", classContainer);
  // create table
  const toolbar = Object.assign(document.createElement("div"), {
    className: "toolbar",
  });
  let categoryDropdown = document.createElement("select");
  let allOption = document.createElement("option");
  allOption.value = "All";
  allOption.text = "All";
  categoryDropdown.appendChild(allOption);

  for (let category of uniqueCategories) {
    let option = document.createElement("option");
    option.value = category;
    option.text = category;
    categoryDropdown.appendChild(option);
  }
  categoryDropdown.addEventListener("change", (e) => {
    const letterGradeContainer = document.querySelector(".class-lettergrade");

    if ((e.target as HTMLSelectElement).value === "All") {
      renderGrade(assignmentData);
      return renderTable(assignmentData);
    }
    let filteredData = assignmentData.filter(
      (assignment) =>
        assignment._assignmentsections[0]._assignmentcategoryassociations[0]
          ._teachercategory.name === (e.target as HTMLSelectElement).value
    );
    //
    renderTable(filteredData);

    renderGrade(assignmentData);
  });
  toolbar.appendChild(categoryDropdown);
  classContainer.appendChild(toolbar);
  const tableContainer = Object.assign(document.createElement("div"), {
    className: "table-container",
  });
  classContainer.appendChild(tableContainer);
  renderTable(assignmentData);
}
const renderGrade = (assignmentData) => {
  const select: HTMLSelectElement = document.querySelector(".toolbar select");
  const letterGradeContainer = document.querySelector(".class-lettergrade");
  let assignments =
    select.value === "All"
      ? assignmentData
      : assignmentData.filter(
          (assignment) =>
            assignment._assignmentsections[0]._assignmentcategoryassociations[0]
              ._teachercategory.name === select.value
        );
  const percent = getGrade(assignments);
  const letterGrade = getLetterGrade(percent);

  letterGradeContainer.innerHTML = `${
    select.value == "All" ? "" : select.value + ": "
  }${letterGrade} | ${percent.toFixed(0)}%`;
};
const renderTable = (assignmentData: any) => {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  table.appendChild(thead);
  table.appendChild(tbody);
  const headerRow = document.createElement("tr");

  const headers = [
    "Due Date",
    "Assignment",
    "Category",
    "Score",
    "Flags",
    "Percent",
    "Letter Grade",
    "Comment",
  ];
  for (let header of headers) {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  let flags = {
    islate: "Late",
    ismissing: "Missing",
    isexempt: "Exempt",
    iscollected: "Collected",
    isabsent: "Absent",
    isincomplete: "Incomplete",
  };
  for (let assignment of assignmentData.sort(
    (a, b) =>
      +new Date(b._assignmentsections[0].duedate) -
      +new Date(a._assignmentsections[0].duedate)
  )) {
    const activeFlags = Object.keys(flags).filter(
      (flag) => assignment._assignmentsections[0]._assignmentscores[0]?.[flag]
    );
    const flagString = activeFlags.map((flag) => flags[flag]).join(", ");
    const scorePoints = gradeOverrides[assignment._assignmentsections[0].assignmentsectionid] ?? assignment._assignmentsections[0]._assignmentscores[0]?.scorePoints;
    const number = getGrade([assignment]);
    console.log('number is', number);
    const grade = {
      number: isNaN(number) ? '--' : number,
      letterGrade: !isNaN(number) ? getLetterGrade(number) : "--",

    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${format(
      assignment._assignmentsections[0].duedate,
      "MMM dd, yyyy"
    )}</td>
    <td>${assignment._assignmentsections[0].name}</td>
    <td style="color: ${numberToColor(
      assignment._assignmentsections[0]._assignmentcategoryassociations[0]
        ._teachercategory.color
    )}">${
      assignment._assignmentsections[0]._assignmentcategoryassociations[0]
        ._teachercategory.name
    }</td>
    <td><span class="points">${
      scorePoints 
    }</span> / ${assignment._assignmentsections[0].scoreentrypoints}</td>
    <td>${flagString}</td>
    <td>${grade.number}%</td>
    <td>${
      grade.letterGrade || "--"
    }</td>
    <td>${
      assignment._assignmentsections[0]._assignmentscores[0]
        ?._assignmentscorecomment?.commentvalue || ""
    }</td>
    `;
    tr.querySelector(".points")?.addEventListener("click", () => {
      const newScore = prompt("Enter new score");
      if (!newScore) return;
      gradeOverrides[assignment._assignmentsections[0].assignmentsectionid] =
        parseInt(newScore);
      console.log(gradeOverrides);
      renderGrade(assignmentData);
      renderTable(assignmentData);
    });

    tbody.appendChild(tr);
  }
  if (!assignmentData.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = headers.length;
    tr.appendChild(td);

    const nothingHere = Object.assign(document.createElement("div"), {
      className: "class-table-nothing",
    });
    nothingHere.textContent = "No assignments yet!";
    td.appendChild(nothingHere);
    tbody.appendChild(tr);
  }
  let tableContainer = document.querySelector(".table-container");
  tableContainer.innerHTML = "";
  tableContainer.appendChild(table);
};

const getLetterGrade = (grade) => {
  grade = Math.round(grade);
  if (grade >= 97) return "A+";
  if (grade >= 93) return "A";
  if (grade >= 90) return "A-";
  if (grade >= 87) return "B+";
  if (grade >= 83) return "B";
  if (grade >= 80) return "B-";
  if (grade >= 77) return "C+";
  if (grade >= 73) return "C";
  if (grade >= 70) return "C-";
  if (grade >= 67) return "D+";
  if (grade >= 63) return "D";
  if (grade >= 60) return "D-";
  return "F";
};
const getGrade = (assignmentData) => {
  let total = 0;
  let earned = 0;
  for (let assignment of assignmentData) {
    
    if (
      !assignment._assignmentsections[0]._assignmentscores.length ||
      !assignment._assignmentsections[0]._assignmentscores?.[0]?.hasOwnProperty(
        "scorepoints"
      )
    ) {
      continue;
    }

    console.log(
      gradeOverrides[assignment._assignmentsections[0].assignmentsectionid]
    );
    let scorePoints =
      gradeOverrides[assignment._assignmentsections[0].assignmentsectionid] ??
      assignment._assignmentsections[0]._assignmentscores[0]?.scorepoints;
    console.log(scorePoints);
    total +=
      assignment._assignmentsections[0].scoreentrypoints *
      assignment._assignmentsections[0].weight;
    console.log('total', total)
    earned +=
      scorePoints *
      assignment._assignmentsections[0].weight;
  }
  return (earned / total) * 100;
};
