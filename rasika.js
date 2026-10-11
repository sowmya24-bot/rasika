const SUPABASE_URL =
    "https://piutbtmxswsvbdmviaxa.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Rti6JVq-fdcBrbgJMVzk8A_tI4pe8ta";


/* =========================================
   SUPABASE CONNECTION
========================================= */

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


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

        registrationForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                /* =====================================
                   GET FORM VALUES
                ===================================== */

                const student = {

                    name:
                        document
                            .getElementById("name")
                            .value
                            .trim(),

                    phone:
                        document
                            .getElementById("phone")
                            .value
                            .trim(),

                    email:
                        document
                            .getElementById("email")
                            .value
                            .trim(),

                    age:
                        document
                            .getElementById("age")
                            .value,

                    danceStyle:
                        document
                            .getElementById("danceStyle")
                            .value,

                    level:
                        document
                            .getElementById("level")
                            .value,

                    interest:
                        document
                            .getElementById("interest")
                            .value,

                    message:
                        document
                            .getElementById("message")
                            .value
                            .trim()

                };


                /* =====================================
                   SHOW SUBMITTING MESSAGE
                ===================================== */

                formMessage.style.display = "block";

                formMessage.innerHTML = `
                    <p>
                        Submitting your registration...
                    </p>
                `;


                /* =====================================
                   SEND DATA TO SUPABASE
                ===================================== */

                const { data, error } =
                    await supabaseClient
                        .from("registrations")
                        .insert([

                            {

                                name: student.name,

                                phone: student.phone,

                                email: student.email,

                                age:
                                    student.age
                                    ? Number(student.age)
                                    : null,

                                danceStyle:
                                    student.danceStyle,

                                level:
                                    student.level,

                                interest:
                                    student.interest,

                                message:
                                    student.message

                            }

                        ]);


                /* =====================================
                   HANDLE ERROR
                ===================================== */

                if (error) {

                    console.error(
                        "Supabase registration error:",
                        error
                    );


                    formMessage.style.display = "block";

                    formMessage.innerHTML = `
                        <h3>
                            Registration Failed ❌
                        </h3>

                        <p>
                            Something went wrong.
                            Please try again.
                        </p>
                    `;

                    return;

                }


                /* =====================================
                   SUCCESS
                ===================================== */

                console.log(
                    "Registration saved successfully:",
                    data
                );


                formMessage.style.display = "block";

                formMessage.innerHTML = `
                    <h3>
                        Registration Received! 🎉
                    </h3>

                    <p>
                        Thank you,
                        <strong>
                            ${escapeHTML(student.name)}
                        </strong>!
                        Our Rasika team will contact you soon.
                    </p>
                `;


                /* =====================================
                   RESET FORM
                ===================================== */

                registrationForm.reset();


                /* =====================================
                   SCROLL TO MESSAGE
                ===================================== */

                formMessage.scrollIntoView({

                    behavior: "smooth",

                    block: "center"

                });

            }
        );

    }


    /* =========================================
       ADMIN DASHBOARD
       TEMPORARILY STILL USING LOCALSTORAGE
========================================= */

    const registrationTableBody =
        document.getElementById(
            "registrationTableBody"
        );

    const studentCount =
        document.getElementById(
            "studentCount"
        );

    const searchStudent =
        document.getElementById(
            "searchStudent"
        );


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

    function displayRegistrations(
        searchText = ""
    ) {

        const registrations =
            JSON.parse(
                localStorage.getItem(
                    "rasikaRegistrations"
                )
            ) || [];


        if (studentCount) {

            studentCount.textContent =
                registrations.length;

        }


        const search =
            searchText
                .toLowerCase()
                .trim();


        const filteredRegistrations =
            registrations.filter(
                function (student) {

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

                }
            );


        if (
            filteredRegistrations.length === 0
        ) {

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


        filteredRegistrations.forEach(
            function (student) {

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
                    row.querySelector(
                        ".delete-btn"
                    );


                deleteButton.addEventListener(
                    "click",
                    function () {

                        deleteRegistration(
                            student.id
                        );

                    }
                );


                registrationTableBody.appendChild(
                    row
                );

            }
        );

    }


    /* =========================================
       ESCAPE HTML
========================================= */

    function escapeHTML(value) {

        return String(value)

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }

});


/* =========================================
   DELETE REGISTRATION
   TEMPORARY LOCALSTORAGE VERSION
========================================= */

function deleteRegistration(id) {

    let registrations =
        JSON.parse(
            localStorage.getItem(
                "rasikaRegistrations"
            )
        ) || [];


    registrations =
        registrations.filter(
            function (student) {

                return student.id !== id;

            }
        );


    localStorage.setItem(
        "rasikaRegistrations",
        JSON.stringify(
            registrations
        )
    );


    location.reload();

}
