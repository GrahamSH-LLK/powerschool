import { addStyle, keywordToSubject } from "../utils";
import styles from "./home.css";
import table from "./table.css";
export default () => {
    addStyle(styles);
    addStyle(table);
  //document.addEventListener("DOMContentLoaded", async function () {
  "use strict";
  const timescales = Array.from(
    document
      .querySelector("#quickLookup")
      .querySelector("tr")
      .querySelectorAll("th")
  )
    .slice(4, 13)
    .map((td) => td.textContent);
  let currTimescale = timescales[0];

  const attendanceTable = document.querySelector("#quickLookup  tbody");
  const attendanceRows = Array.from(attendanceTable.querySelectorAll(
    "tr:not(.th2):not(:has(#attTotal))"
  ));

  const attendanceData = [];
  for (let row of attendanceRows) {
    // first td is the schedule
    const schedule = row.querySelector("td").textContent;
    // next 11 tds are the attendance
    const attendance = Array.from(row.querySelectorAll("td"))
      .slice(1, 11)
      .map((td) => td.textContent)
      .map((attendance) => {
        //return attendance;
        /* Blank=Present | A=Absent | D=Dismissed | F=FIELD TRIP | FT=Free Tardy | HP=Hospitalized Present | IV=ICE Verified | K=absent but accounted for | M=Medical absence | N=Nurse Dismissal | SSC=Student Support Center | U=Tardy Unexcused | V=Verified absence | X=Tardy Excused | O=Out of building-Internship | PS=Pupil Services | WC=Writing Center Appointment | Y=S Warren | Z=NURSE STAY - Full Block | C=ICE ABSENCE | CA=ICE CUT ADDRESSED | TCF=First T10 Cut | T1=Tardy 5 min 1% cut | T2=Tardy 10 min 2% cut | T3=Tardy 15 min 3% cut | T4=Tardy 20 min 4% cut | T5=Tardy 25 min 5% cut | T6=Tardy 30 min 6% cut | T7=Tardy 35 min 7% cut | T8=Tardy 40 min 8% cut | T9=Tardy 45 min 9% cut | T10=Full cut 10% | L=Library | PEM=ICE student making up PE | I=Internal Suspension | S=External Suspension | TAP=Susp. Alt. Placement | QA=Quarantined Absent | QP=Quarantined Present | RA=Remote Absent | RD=Remote Dismissed | RP=Remote Present | RT10=Remote - Full cut 10% | RU=Remote - Tardy Unexcused | RV=Remote Verified | RX=Remote Tardy Excused | -=Didn't meet, wrong semester | . =Didn't meet*/
        switch (attendance.trim()) {
          case "":
            return "Present";
          case "Not available":
            return "Not available";
          case "A":
            return "Absent";
          case "D":
            return "Dismissed";
          case "F":
            return "Field Trip";
          case "FT":
            return "Free Tardy";
          case "HP":
            return "Hospitalized Present";
          case "IV":
            return "ICE Verified";
          case "K":
            return "Absent but accounted for";
          case "M":
            return "Medical Absence";
          case "N":
            return "Nurse Dismissal";
          case "SSC":
            return "Student Support Center";
          case "U":
            return "Tardy Unexcused";
          case "V":
            return "Verified Absence";
          case "X":
            return "Tardy Excused";
          case "O":
            return "Out of building-Internship";
          case "PS":
            return "Pupil Services";
          case "WC":
            return "Writing Center Appointment";
          case "Y":
            return "S Warren";
          case "Z":
            return "Nurse Stay - Full Block";
          case "C":
            return "ICE Absence";
          case "CA":
            return "ICE Cut Addressed";
          case "TCF":
            return "First T10 Cut";
          case "T1":
            return "Tardy 5 min 1% cut";
          case "T2":
            return "Tardy 10 min 2% cut";
          case "T3":
            return "Tardy 15 min 3% cut";
          case "T4":
            return "Tardy 20 min 4% cut";
          case "T5":
            return "Tardy 25 min 5% cut";
          case "T6":
            return "Tardy 30 min 6% cut";
          case "T7":
            return "Tardy 35 min 7% cut";
          case "T8":
            return "Tardy 40 min 8% cut";
          case "T9":
            return "Tardy 45 min 9% cut";
          case "T10":
            return "Full cut 10%";
          case "L":
            return "Library";
          case "PEM":
            return "ICE student making up PE";
          case "I":
            return "Internal Suspension";
          case "S":
            return "External Suspension";
          case "TAP":
            return "Susp. Alt. Placement";
          case "QA":
            return "Quarantined Absent";
          case "QP":
            return "Quarantined Present";
          case "RA":
            return "Remote Absent";
          case "RD":
            return "Remote Dismissed";
          case "RP":
            return "Remote Present";
          case "RT10":
            return "Remote - Full cut 10%";
          case "RU":
            return "Remote - Tardy Unexcused";
          case "RV":
            return "Remote Verified";
          case "RX":
            return "Remote Tardy Excused";
          case "-":
            return "Didn't meet, wrong semester";
          case ".":
            return "Didn't meet";
          default:
            console.log(attendance.trim(), attendance.trim().length);
            return "Unknown";
        }
      });
    const classData = row.querySelector("td:nth-child(12)");
    const className = classData.childNodes[0].textContent;
    const teacher = classData.childNodes[4].textContent.split("Email ")[1];
    const room =
      classData.childNodes[6].textContent.split("Rm: ")[1] ||
      classData.childNodes[6].textContent.split("Rm: ")[1];

    // next 9 tds are the grades
    // q1, q2,e1, s1,q3, q4,e2, s2, final

    let grades = Array.from(row.querySelectorAll("td"))
      .slice(12, 21)

      .map((td) => {
        let link = td.querySelector("a")?.getAttribute("href");

        if (td.textContent === "[ i ]") {
          return { letterGrade: "", number: "", link };
        }
        let split;
        if (td.childNodes[0].childNodes.length > 1) {
          let a = td.childNodes[0];
          split = [a.childNodes[0]?.textContent, a.childNodes[2]?.textContent];
        } else {
          split = [undefined, td.innerText.trim()];
        }
        return {
          letterGrade: split?.[0],
          number: split?.[1],
          link,
          textContent: td.innerText,
        };
      });

    let gradeData = {};
    for (let i = 0; i < timescales.length; i++) {
      gradeData[timescales[i]] = grades[i];
    }

    attendanceData.push({
      schedule,
      attendance,
      className,
      teacher,
      room,
      gradeData,
      subject: keywordToSubject(className),
    });
  }
  console.log(attendanceData);
  const tabsEl = document.querySelector(".tabs");
  const dropdown = Object.assign(document.createElement("select"), {
    id: "timescale",
  });
  for (let timescale of timescales) {
    const option = Object.assign(document.createElement("option"), {
      value: timescale,
      textContent: timescale,
    });
    dropdown.appendChild(option);
  }
  tabsEl.insertAdjacentElement("beforeend", dropdown);
  dropdown.addEventListener("change", () => {
    currTimescale = dropdown.value;
    render();
  });

  const modalBg = document.body.appendChild(
    Object.assign(document.createElement("div"), {
      className: "modal-bg",
    })
  );
  const modal = document.body.appendChild(
    Object.assign(document.createElement("div"), {
      className: "modal",
    })
  );
  const openModal = (attendance) => {
    modal.innerHTML = "";
    const close = modal.appendChild(document.createElement("div"));
    close.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
`;
    close.classList.add("close");
    close.addEventListener("click", closeModal);
    const tableContainer = modal.appendChild(document.createElement("div"));
    tableContainer.classList.add("table-container");
    const table = tableContainer.appendChild(document.createElement("table"));
    const thead = table.appendChild(document.createElement("thead"));
    const tbody = table.appendChild(document.createElement("tbody"));
    const header = thead.appendChild(document.createElement("tr"));
    header.appendChild(document.createElement("th")).textContent = "Day";
    header.appendChild(document.createElement("th")).textContent = "Attendance";
    for (let i = 0; i < 10; i++) {
      let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      let twoWeeks = [...days, ...days];

      const tr = tbody.appendChild(document.createElement("tr"));
      tr.appendChild(document.createElement("td")).textContent = twoWeeks[i];
      tr.appendChild(document.createElement("td")).textContent = attendance[i];
    }
    modal.style.display = "block";
    modalBg.style.display = "block";
  };
  const closeModal = () => {
    modal.style.display = "none";
    modalBg.style.display = "none";
  };
  modalBg.addEventListener("click", closeModal);

  let render = () => {
    document.querySelector(".card-container")?.remove();
    const cardContainer = Object.assign(document.createElement("div"), {
      className: "card-container",
    });
    tabsEl.insertAdjacentElement("afterend", cardContainer);
    for (let data of attendanceData.filter(
      (data) => data.gradeData[currTimescale].number != "Not available"
    )) {
      const card = Object.assign(document.createElement("a"), {
        className: "card",
        href: data.gradeData[currTimescale].link,
      });
      const header = Object.assign(document.createElement("div"), {
        className: "card-item card-header",

        // https://gh.grahamsh.com/empty/pscat/class-category-arts115x155@3x.png
      });

      header.setAttribute("data-subject", data.subject);
      header.appendChild(
        Object.assign(document.createElement("div"), {
          className: "card-header-top",
          textContent: data.gradeData[currTimescale].number
            ? data.gradeData[currTimescale].number + "%"
            : "",
        })
      );
      header.appendChild(
        document.createTextNode(
          data.gradeData[currTimescale].letterGrade || "--"
        )
      );

      const mid = Object.assign(document.createElement("div"), {
        className: "card-mid card-item",
      });
      mid.appendChild(
        Object.assign(document.createElement("span"), {
          textContent: data.className,
        })
      );
      const leftContainer = Object.assign(document.createElement("div"), {});
      leftContainer.appendChild(
        Object.assign(document.createElement("p"), {
          textContent: "Room " + data.room,
          className: "teacher",
        })
      );
      leftContainer.appendChild(
        Object.assign(document.createElement("p"), {
          textContent: data.teacher,
          className: "teacher",
        })
      );
      mid.appendChild(leftContainer);
      const footer = Object.assign(document.createElement("div"), {
        className: "card-footer card-item",
      });
      footer.appendChild(
        Object.assign(document.createElement("span"), {
          textContent: `${
            data.attendance.filter((x) => {
              x == "Absent";
            }).length
          } recent absences`,
        })
      );
      const viewButton = Object.assign(document.createElement("button"), {});
      const icon = document.createElement("div");
      viewButton.appendChild(icon);

      icon.outerHTML = `
<div>
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.06714 2.81802C6.22323 3.66193 5.74912 4.80653 5.74912 6C5.74912 7.19347 6.22323 8.33807 7.06714 9.18198C7.91105 10.0259 9.05565 10.5 10.2491 10.5C10.256 10.5 10.2628 10.5 10.2697 10.5C10.4799 7.95221 12.2819 5.85582 14.6788 5.20758C14.518 4.30847 14.0858 3.47275 13.4311 2.81802C12.5872 1.97411 11.4426 1.5 10.2491 1.5C9.05565 1.5 7.91105 1.97411 7.06714 2.81802ZM10.3294 11.9838C10.7988 14.8295 13.2705 17 16.2491 17C16.7692 17 17.2738 16.9338 17.755 16.8094C18.223 17.8354 18.4802 18.9561 18.4981 20.105C18.5007 20.2508 18.4608 20.3942 18.3832 20.5176C18.3055 20.641 18.1936 20.7392 18.0611 20.8C15.6103 21.9237 12.9453 22.5037 10.2491 22.5C7.46312 22.5 4.81612 21.892 2.43712 20.8C2.30461 20.7392 2.19269 20.641 2.11508 20.5176C2.03747 20.3942 1.99752 20.2508 2.00012 20.105C2.03384 17.9395 2.91776 15.8741 4.46108 14.3546C6.0044 12.8351 8.08333 11.9834 10.2491 11.9834C10.2759 11.9834 10.3026 11.9836 10.3294 11.9838Z" fill="currentColor"/>
<path d="M16.2491 7.66667V11H18.7491M21.2491 11C21.2491 11.6566 21.1198 12.3068 20.8685 12.9134C20.6172 13.52 20.2489 14.0712 19.7847 14.5355C19.3204 14.9998 18.7692 15.3681 18.1625 15.6194C17.5559 15.8707 16.9057 16 16.2491 16C15.5925 16 14.9423 15.8707 14.3357 15.6194C13.7291 15.3681 13.1779 14.9998 12.7136 14.5355C12.2493 14.0712 11.881 13.52 11.6297 12.9134C11.3784 12.3068 11.2491 11.6566 11.2491 11C11.2491 9.67392 11.7759 8.40215 12.7136 7.46447C13.6513 6.52678 14.923 6 16.2491 6C17.5752 6 18.847 6.52678 19.7847 7.46447C20.7223 8.40215 21.2491 9.67392 21.2491 11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg></div>
`;

      viewButton.addEventListener("click", (event) => {
        event.preventDefault();
        openModal(data.attendance);
      });
      footer.appendChild(viewButton);

      card.appendChild(header);
      card.appendChild(mid);
      card.appendChild(footer);

      cardContainer.appendChild(card);
    } //beer
  };
  // inject css
  render();

  //});
};
