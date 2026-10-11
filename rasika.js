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


            // ---------------------------------------------
            // GET FORM VALUES
            // ---------------------------------------------

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


            // ---------------------------------------------
            // SHOW SUBMITTING MESSAGE
            // ---------------------------------------------

            if (registrationMessage) {

                registrationMessage.style.display =
                    "block";

                registrationMessage.innerHTML =
                    "Submitting registration...";

            }


            // ---------------------------------------------
            // SEND DATA TO SUPABASE
            // ---------------------------------------------

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


            // ---------------------------------------------
            // REGISTRATION ERROR
            // ---------------------------------------------

            if (error) {

                console.error(
                    "Supabase registration error:",
                    error
                );


                if (registrationMessage) {

                    registrationMessage.style.display =
                        "block";

                    registrationMessage.innerHTML = `
                        <h2>
                            Registration Failed ❌
                        </h2>

                        <p>
                            Please try again.
                        </p>
                    `;

                }

                return;
            }


            // ---------------------------------------------
            // REGISTRATION SUCCESS
            // ---------------------------------------------

            console.log(
                "Registration saved successfully:",
                data
            );


            if (registrationMessage) {

                registrationMessage.style.display =
                    "block";

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


            // ---------------------------------------------
            // CLEAR FORM
            // ---------------------------------------------

            registrationForm.reset();


            // ---------------------------------------------
            // SCROLL TO SUCCESS MESSAGE
            // ---------------------------------------------

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


    // ---------------------------------------------
    // ADMIN LOAD ERROR
    // ---------------------------------------------

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


    // ---------------------------------------------
    // SAVE REGISTRATIONS
    // ---------------------------------------------

    registrations = data || [];


    // ---------------------------------------------
    // UPDATE STUDENT COUNT
    // ---------------------------------------------

    if (studentCount) {

        studentCount.textContent =
            registrations.length;

    }


    // ---------------------------------------------
    // DISPLAY REGISTRATIONS
    // ---------------------------------------------

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


    // ---------------------------------------------
    // NO REGISTRATIONS
    // ---------------------------------------------

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


    // ---------------------------------------------
    // CREATE TABLE ROWS
    // ---------------------------------------------

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
// SEARCH STUDENTS
// =====================================================

if (searchStudent) {

    searchStudent.addEventListener(
        "input",
        function () {

            const search =
                searchStudent.value
                    .toLowerCase()
                    .trim();


            // -----------------------------------------
            // SHOW ALL
            // -----------------------------------------

            if (!search) {

                displayRegistrations(
                    registrations
                );

                return;

            }


            // -----------------------------------------
            // FILTER
            // -----------------------------------------

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


    // ---------------------------------------------
    // DELETE ERROR
    // ---------------------------------------------

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


    // ---------------------------------------------
    // RELOAD TABLE
    // ---------------------------------------------

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
