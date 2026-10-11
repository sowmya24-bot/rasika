console.log("RASIKA JS LOADED");

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       JOIN FORM
    ========================================= */

    const registrationForm =
        document.getElementById("registrationForm");

    const formMessage =
        document.getElementById("formMessage");


    if (registrationForm) {

        registrationForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const student = {

                id: Date.now(),

                name:
                    document.getElementById("name").value.trim(),

                phone:
                    document.getElementById("phone").value.trim(),

                email:
                    document.getElementById("email").value.trim(),

                age:
                    document.getElementById("age").value,

                danceStyle:
                    document.getElementById("danceStyle").value,

                level:
                    document.getElementById("level").value,

                interest:
                    document.getElementById("interest").value,

                message:
                    document.getElementById("message").value.trim()

            };


            let registrations =
                JSON.parse(
                    localStorage.getItem("rasikaRegistrations")
                ) || [];


            registrations.push(student);


            localStorage.setItem(
                "rasikaRegistrations",
                JSON.stringify(registrations)
            );


            formMessage.style.display = "block";

            formMessage.innerHTML = `
                <h3>Registration Received! 🎉</h3>

                <p>
                    Thank you,
                    <strong>${escapeHTML(student.name)}</strong>!
                    Our Rasika team will contact you soon.
                </p>
            `;


            registrationForm.reset();


            formMessage.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        });

    }


    /* =========================================
       ADMIN DASHBOARD
    ========================================= */

    const registrationTableBody =
        document.getElementById("registrationTableBody");

    const studentCount =
        document.getElementById("studentCount");

    const searchStudent =
        document.getElementById("searchStudent");


    if (registrationTableBody) {

        displayRegistrations();

    }


    if (searchStudent) {

        searchStudent.addEventListener(
            "input",
            function () {

                displayRegistrations(
                    searchStudent.value
                );

            }
        );

    }


    /* =========================================
       DISPLAY REGISTRATIONS
    ========================================= */

    function displayRegistrations(searchText = "") {

        const registrations =
            JSON.parse(
                localStorage.getItem("rasikaRegistrations")
            ) || [];


        if (studentCount) {

            studentCount.textContent =
                registrations.length;

        }


        const search =
            searchText.toLowerCase().trim();


        const filteredRegistrations =
            registrations.filter(function (student) {

                return (

                    student.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    student.email
                        .toLowerCase()
                        .includes(search)

                    ||

                    student.danceStyle
                        .toLowerCase()
                        .includes(search)

                    ||

                    student.level
                        .toLowerCase()
                        .includes(search)

                );

            });


        if (filteredRegistrations.length === 0) {

            registrationTableBody.innerHTML = `
                <tr>

                    <td colspan="8">

                        <div class="empty-message">

                            ${
                                registrations.length === 0
                                ? "No registrations yet."
                                : "No matching registrations found."
                            }

                        </div>

                    </td>

                </tr>
            `;

            return;

        }


        registrationTableBody.innerHTML = "";


        filteredRegistrations.forEach(function (student) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(student.name)}
                </td>

                <td>
                    ${escapeHTML(student.phone)}
                </td>

                <td>
                    ${escapeHTML(student.email)}
                </td>

                <td>
                    ${escapeHTML(student.age)}
                </td>

                <td>
                    ${escapeHTML(student.danceStyle)}
                </td>

                <td>
                    ${escapeHTML(student.level)}
                </td>

                <td>
                    ${escapeHTML(student.interest)}
                </td>

                <td>

                    <button
                        class="delete-btn"
                        data-id="${student.id}"
                    >
                        Delete
                    </button>

                </td>

            `;


            const deleteButton =
                row.querySelector(".delete-btn");


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteRegistration(student.id);

                }
            );


            registrationTableBody.appendChild(row);

        });

    }


    /* =========================================
       ESCAPE HTML
    ========================================= */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }

});


/* =========================================
   DELETE REGISTRATION
========================================= */

function deleteRegistration(id) {

    let registrations =
        JSON.parse(
            localStorage.getItem("rasikaRegistrations")
        ) || [];


    registrations =
        registrations.filter(function (student) {

            return student.id !== id;

        });


    localStorage.setItem(
        "rasikaRegistrations",
        JSON.stringify(registrations)
    );


    location.reload();

}
