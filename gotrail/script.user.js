// ==UserScript==
// @name         GoTrail Race Status
// @namespace    http://gotrail.run/
// @version      2026-02-01
// @description  Add options to save personnal status
// @author       Coni63
// @match        https://gotrail.run/*/calendrier/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==



(function() {
    'use strict';

    const courses = GM_getValue("courses", {});
    const STATUS_COLORS = {
        interesse: "#3498db",
        pas_interesse: "#95a5a6",
        inscrit: "#2ecc71",
        absent: "#95a5a6"
    };

    // console.log(courses);

    var elements = document.querySelectorAll("section.mt-7");
    console.log(elements.length);

    elements.forEach(race => {
        var link_obj = race.querySelectorAll("a.flex")[1];
        var url = link_obj.href
        // console.log(url);

        var parent = link_obj.parentNode;
        link_obj.remove();

        addControls(parent, url);
        applyStatus(parent, url);
    });

    function saveStatus(url, status) {
        // console.log("Save status for " + url + " to " + status);
        courses[url] = status;
        GM_setValue("courses", courses);
    }

    function applyStatus(courseEl, url) {
        const status = courses[url];
        if (!status) return;

        courseEl.style.borderLeft = `6px solid ${STATUS_COLORS[status]}`;
        courseEl.dataset.status = status;
    }

    function addControls(courseEl, url) {
        const select = document.createElement("select");
        select.classList.add(
            "flex", "items-center", "justify-between", "rounded-md",
            "border", "border-gray-300", "bg-white", "px-4", "py-2",
            "text-sm", "font-medium", "text-gray-700", "shadow-sm",
            "hover:border-gray-400", "focus:outline-none", "focus:ring-2",
            "focus:ring-indigo-500", "focus:border-transparent", "w-auto"
        );
        select.innerHTML = `
    <option value="">—</option>
    <option value="interesse">Intéressé</option>
    <option value="pas_interesse">Pas intéressé</option>
    <option value="inscrit">Inscrit</option>
    <option value="absent">Absent</option>
  `;

        select.value = courses[url] ?? "";

        select.addEventListener("change", () => {
            if (!select.value) return;
            saveStatus(url, select.value);
            applyStatus(courseEl, url);
        });

        courseEl.appendChild(select);
    }
})();