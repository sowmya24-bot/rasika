console.log("RASIKA JS LOADED");


// =====================================================
// SUPABASE CONFIGURATION
// =====================================================

const SUPABASE_URL =
    "https://piutbtmxswsvbdmviaxa.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Rti6JVq-fdcBrbgJMVzk8A_tI4pe8ta";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =====================================================
// JOIN / REGISTRATION
// =====================================================

const registrationForm =
    document.getElementById("registrationForm");

const registrationMessage =
    document.getElementById("formMessage");


if (registrationForm) {

    registrationForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const student = {

                name:
                    document
                        .getElementById("name")
                        ?.value
                        .trim() || "",

                phone:
                    document
                        .getElementById("phone")
                        ?.value
                        .trim() || "",

                email:
                    document
                        .getElementById("email")
                        ?.value
                        .trim() || "",

                age:
                    document
                        .getElementById("age")
                        ?.value || "",

                danceStyle:
                    document
                        .getElementById("danceStyle")
                        ?.value || "",

                level:
                    document
                        .getElementById("level")
                        ?.value || "",

                interest:
                    document
                        .getElementById("interest")
                        ?.value || "",

                message:
                    document
                        .getElementById("message")
                        ?.value
                        .trim() || ""

            };


            // Show submitting message

            if (registrationMessage) {

                registrationMessage.style.display =
                    "block";

                registrationMessage.innerHTML =
                    "Submitting registration...";

            }


            // =================================================
            // SEND REGISTRATION TO SUPABASE
            // =================================================

            const {
                data,
                error
            } = await supabaseClient
                .from("registrations")
                .insert([
                    {
                        name: student.name,
                        phone: student.phone,
                        email: student.email,
                        age: student.age
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


            // =================================================
            // ERROR
            // =================================================

            if (error) {

                console.error(
                    "Supabase registration error:",
                    error
                );


                if (registrationMessage) {

                    registrationMessage.style.display =
                        "block";

                    registrationMessage.innerHTML =
                        "Registration Failed ❌<br>" +
                        "Please try again.";

                }

                return;
            }


            // =================================================
            // SUCCESS
            // =================================================

            console.log(
                "Registration saved successfully:",
                data
            );


            iif (registrationMessage) {

    registrationMessage.style.display = "block";

    registrationMessage.innerHTML = `
        <h2>
            Registration Received! 🎉
        </h2>

        <p>
            Thank you, ${escapeHTML(student.name)}!
            Our Rasika team will contact you soon.
        </p>
    `;

}


            registrationForm.reset();


            if (registrationMessage) {

                registrationMessage.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        }
    );

}


// =====================================================
// ADMIN DASHBOARD
// =====================================================

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


let registrations = [];


// =====================================================
// LOAD REGISTRATIONS FROM SUPABASE
// =====================================================

async function loadRegistrations() {

    if (!registrationTableBody) {
        return;
    }


    registrationTableBody.innerHTML = `
        <tr>
            <td colspan="8">
                <div class="empty-message">
                    Loading registrations...
                </div>
            </td>
        </tr>
    `;


    const {
        data,
        error
    } = await supabaseClient
        .from("registrations")
        .select("*")
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Supabase admin error:",
            error
        );


        registrationTableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    <div class="empty-message">
                        Unable to load registrations.
                    </div>
                </td>
            </tr>
        `;


        if (studentCount) {
            studentCount.textContent = "0";
        }


        return;
    }


    registrations = data || [];


    if (studentCount) {

        studentCount.textContent =
            registrations.length;

    }


    displayRegistrations(
        registrations
    );

}


// =====================================================
// DISPLAY REGISTRATIONS
// =====================================================

function displayRegistrations(list) {

    if (!registrationTableBody) {
        return;
    }


    if (!list || list.length === 0) {

        registrationTableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    <div class="empty-message">
                        No registrations yet.
                    </div>
                </td>
            </tr>
        `;

        return;
    }


    registrationTableBody.innerHTML =
        list.map(function (student) {

            return `

                <tr>

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
                        ${student.age ?? ""}
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
                            class="btn"
                            onclick="deleteRegistration(${student.id})"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        }).join("");

}


// =====================================================
// SEARCH
// =====================================================

if (searchStudent) {

    searchStudent.addEventListener(
        "input",
        function () {

            const search =
                searchStudent.value
                    .toLowerCase()
                    .trim();


            if (!search) {

                displayRegistrations(
                    registrations
                );

                return;

            }


            const filtered =
                registrations.filter(
                    function (student) {

                        return (

                            String(
                                student.name || ""
                            )
                                .toLowerCase()
                                .includes(search)

                            ||

                            String(
                                student.email || ""
                            )
                                .toLowerCase()
                                .includes(search)

                            ||

                            String(
                                student.danceStyle || ""
                            )
                                .toLowerCase()
                                .includes(search)

                            ||

                            String(
                                student.level || ""
                            )
                                .toLowerCase()
                                .includes(search)

                        );

                    }
                );


            displayRegistrations(
                filtered
            );

        }
    );

}


// =====================================================
// DELETE REGISTRATION
// =====================================================

async function deleteRegistration(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this registration?"
        );


    if (!confirmed) {
        return;
    }


    const {
        error
    } = await supabaseClient
        .from("registrations")
        .delete()
        .eq("id", id);


    if (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            "Unable to delete registration."
        );


        return;
    }


    await loadRegistrations();

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// START ADMIN DASHBOARD
// =====================================================

if (registrationTableBody) {

    loadRegistrations();

}
