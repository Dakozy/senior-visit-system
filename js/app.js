/*
====================================================
Senior Care Visit Form
app.js

Frontend:
GitHub Pages

Backend:
Google Apps Script Web App

Database:
Google Sheets
====================================================
*/


/*
====================================================
CONFIGURATION
====================================================
*/

//const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyuU38Cwyld6INmQC_jlpnias-G2XkLYz_-_MLwDPAigFob4r3ylvcflQLZQTiEuHk/exec";

const SCRIPT_url = "https://script.google.com/macros/s/AKfycbwNtvGU1b5_odSFY84fx9ogzz4cLh_l77_Ha_XbAt7YkZS9prdUk1yReFZChCt0_Pcb/exec";

/*
====================================================
CONFIGURATION VALIDATION
====================================================
*/

if (
    !SCRIPT_URL ||
    !SCRIPT_URL.includes("/exec")
) {

    console.error(
        "Invalid Apps Script Web App URL."
    );

}


/*
====================================================
GET HTML ELEMENTS
====================================================
*/

const form =
    document.getElementById("visitForm");

const status =
    document.getElementById("status");

const submitButton =
    document.getElementById("submitButton");

const photo =
    document.getElementById("photo");

const preview =
    document.getElementById("preview");

const timestamp =
    document.getElementById("timestamp");

const latitude =
    document.getElementById("latitude");

const longitude =
    document.getElementById("longitude");


/*
====================================================
INITIAL VALIDATION
====================================================
*/

if (!form) {

    console.error(
        "ERROR: visitForm was not found."
    );

}


/*
====================================================
UTILITY: SHOW STATUS
====================================================
*/

function showStatus(
    message,
    type = "info"
) {

    if (!status) return;


    status.textContent = message;


    if (type === "success") {

        status.style.color = "green";

    }

    else if (type === "error") {

        status.style.color = "red";

    }

    else if (type === "warning") {

        status.style.color = "orange";

    }

    else {

        status.style.color = "blue";

    }

}


/*
====================================================
UTILITY: RESET TIMESTAMP
====================================================
*/

function updateTimestamp() {

    if (timestamp) {

        timestamp.value =
            new Date().toISOString();

    }

}


/*
====================================================
INITIAL TIMESTAMP
====================================================
*/

updateTimestamp();


/*
====================================================
GEOLOCATION
====================================================
*/

if ("geolocation" in navigator) {

    navigator.geolocation.getCurrentPosition(

        function (position) {

            latitude.value =
                position.coords.latitude;

            longitude.value =
                position.coords.longitude;

            console.log(
                "Location captured successfully."
            );

        },

        function (error) {

            console.warn(
                "Unable to obtain location:",
                error.message
            );

            /*
            Do not stop the entire form.
            The visit can still be submitted.
            */

            showStatus(
                "Location could not be obtained. You may continue.",
                "warning"
            );

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }

    );

}

else {

    console.warn(
        "Geolocation is not supported by this browser."
    );

}


/*
====================================================
PHOTO PREVIEW + VALIDATION
====================================================
*/

if (photo) {

    photo.addEventListener(
        "change",
        function () {

            /*
            Remove previous preview
            */

            preview.style.display = "none";

            preview.removeAttribute("src");


            /*
            No file selected
            */

            if (!this.files || this.files.length === 0) {

                return;

            }


            const file =
                this.files[0];


            /*
            Validate file type
            */

            if (!file.type.startsWith("image/")) {

                showStatus(
                    "Please select a valid image file.",
                    "error"
                );

                this.value = "";

                return;

            }


            /*
            Maximum file size:
            5 MB
            */

            const MAX_FILE_SIZE =
                5 * 1024 * 1024;


            if (file.size > MAX_FILE_SIZE) {

                showStatus(
                    "Photo is too large. Maximum size is 5 MB.",
                    "error"
                );

                this.value = "";

                return;

            }


            /*
            Create preview
            */

            const imageURL =
                URL.createObjectURL(file);

            preview.src = imageURL;

            preview.style.display = "block";


            /*
            Release object URL after image loads
            */

            preview.onload = function () {

                URL.revokeObjectURL(imageURL);

            };

        }
    );

}


/*
====================================================
FORM SUBMISSION
====================================================
*/

if (form) {

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /*
            Prevent accidental double submission
            */

            if (
                submitButton &&
                submitButton.disabled
            ) {

                return;

            }


            /*
            Browser validation
            */

            if (!form.checkValidity()) {

                form.reportValidity();

                return;

            }


            /*
            Check Internet connection
            */

            if (!navigator.onLine) {

                showStatus(
                    "You appear to be offline. Please reconnect and try again.",
                    "error"
                );

                return;

            }


            /*
            Validate Apps Script URL
            */

            if (
                !SCRIPT_URL ||
                !SCRIPT_URL.includes("/exec")
            ) {

                showStatus(
                    "System configuration error. Please contact the administrator.",
                    "error"
                );

                console.error(
                    "Invalid SCRIPT_URL:",
                    SCRIPT_URL
                );

                return;

            }


            /*
            Disable submit button
            */

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Submitting...";

                submitButton.style.opacity =
                    "0.7";

            }


            showStatus(
                "Submitting visit record...",
                "info"
            );


            /*
            Collect form data
            */

            const formData =
                new FormData(form);


            /*
            Timeout controller
            */

            const controller =
                new AbortController();


            const timeout =
                setTimeout(
                    function () {

                        controller.abort();

                    },
                    30000
                );


            try {


                /*
                Send request
                */

                const response =
                    await fetch(
                        SCRIPT_URL,
                        {
                            method: "POST",

                            body: formData,

                            signal:
                                controller.signal
                        }
                    );


                /*
                Clear timeout
                */

                clearTimeout(timeout);


                /*
                Check HTTP status
                */

                if (!response.ok) {

                    throw new Error(
                        "Server returned HTTP " +
                        response.status
                    );

                }


                /*
                Read response
                */

                const responseText =
                    await response.text();


                console.log(
                    "Apps Script response:",
                    responseText
                );


                /*
                Try to parse JSON
                */

                let result;


                try {

                    result =
                        JSON.parse(responseText);

                }

                catch (jsonError) {

                    /*
                    Apps Script returned something
                    that was not valid JSON.
                    */

                    throw new Error(
                        "Invalid response received from server."
                    );

                }


                /*
                Check application-level response
                */

                if (
                    result &&
                    result.success === true
                ) {

                    showStatus(
                        "Visit submitted successfully.",
                        "success"
                    );


                    /*
                    Reset form
                    */

                    form.reset();


                    /*
                    Hide photo preview
                    */

                    if (preview) {

                        preview.style.display =
                            "none";

                        preview.removeAttribute(
                            "src"
                        );

                    }


                    /*
                    Generate new timestamp
                    */

                    updateTimestamp();


                    /*
                    Optional success log
                    */

                    console.log(
                        "Visit submitted successfully."
                    );

                }

                else {

                    /*
                    Apps Script responded,
                    but reported an application error.
                    */

                    const serverMessage =
                        result &&
                        result.error
                            ? result.error
                            : "The server rejected the submission.";

                    throw new Error(
                        serverMessage
                    );

                }


            }

            catch (error) {


                /*
                Clear timeout
                */

                clearTimeout(timeout);


                /*
                Handle timeout
                */

                if (
                    error.name ===
                    "AbortError"
                ) {

                    showStatus(
                        "The submission timed out. Please check your connection and try again.",
                        "error"
                    );

                }

                /*
                Handle network error
                */

                else if (
                    error instanceof TypeError
                ) {

                    showStatus(
                        "Unable to connect to the server. Please check your internet connection.",
                        "error"
                    );

                }

                /*
                Handle all other errors
                */

                else {

                    showStatus(
                        "Submission failed: " +
                        error.message,
                        "error"
                    );

                }


                /*
                Log technical details
                */

                console.error(
                    "Submission error:",
                    error
                );

            }


            finally {


                /*
                Always restore button
                */

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Submit Visit";

                    submitButton.style.opacity =
                        "1";

                }

            }

        }
    );

}


/*
====================================================
GLOBAL JAVASCRIPT ERROR HANDLER
====================================================
*/

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "Unexpected JavaScript error:",
            event.error
        );

    }
);


/*
====================================================
UNHANDLED PROMISE ERROR HANDLER
====================================================
*/

window.addEventListener(
    "unhandledrejection",
    function (event) {

        console.error(
            "Unhandled Promise rejection:",
            event.reason
        );

    }
);
