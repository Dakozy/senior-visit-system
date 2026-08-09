```javascript
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

PHOTO:
Browser File → Base64 → Google Apps Script → Google Drive
====================================================
*/


/*
====================================================
CONFIGURATION
====================================================
*/

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyuU38Cwyld6INmQC_jlpnias-G2XkLYz_-_MLwDPAigFob4r3ylvcflQLZQTiEuHk/exec";


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


    status.textContent =
        message;


    if (type === "success") {

        status.style.color =
            "green";

    }

    else if (type === "error") {

        status.style.color =
            "red";

    }

    else if (type === "warning") {

        status.style.color =
            "orange";

    }

    else {

        status.style.color =
            "blue";

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

            if (latitude) {

                latitude.value =
                    position.coords.latitude;

            }

            if (longitude) {

                longitude.value =
                    position.coords.longitude;

            }


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
            Do not stop the form.
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
            ------------------------------------------------
            Remove previous preview
            ------------------------------------------------
            */

            if (preview) {

                preview.style.display =
                    "none";

                preview.removeAttribute(
                    "src"
                );

            }


            /*
            ------------------------------------------------
            No file selected
            ------------------------------------------------
            */

            if (
                !this.files ||
                this.files.length === 0
            ) {

                return;

            }


            /*
            ------------------------------------------------
            Get selected file
            ------------------------------------------------
            */

            const file =
                this.files[0];


            /*
            ------------------------------------------------
            Validate file type
            ------------------------------------------------
            */

            if (
                !file.type ||
                !file.type.startsWith("image/")
            ) {

                showStatus(
                    "Please select a valid image file.",
                    "error"
                );

                this.value =
                    "";

                return;

            }


            /*
            ------------------------------------------------
            Maximum photo size: 5 MB
            ------------------------------------------------
            */

            const MAX_FILE_SIZE =
                5 * 1024 * 1024;


            if (
                file.size >
                MAX_FILE_SIZE
            ) {

                showStatus(
                    "Photo is too large. Maximum size is 5 MB.",
                    "error"
                );

                this.value =
                    "";

                return;

            }


            /*
            ------------------------------------------------
            Create preview
            ------------------------------------------------
            */

            if (preview) {

                const imageURL =
                    URL.createObjectURL(
                        file
                    );


                preview.src =
                    imageURL;


                preview.style.display =
                    "block";


                preview.onload =
                    function () {

                        URL.revokeObjectURL(
                            imageURL
                        );

                    };

            }

        }
    );

}


/*
====================================================
UTILITY:
CONVERT FILE TO BASE64
====================================================

Returns the complete data URL:

data:image/jpeg;base64,/9j/4AAQ...

Code.gs can decode this and save it
directly to Google Drive.
====================================================
*/

function fileToBase64(
    file
) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function () {

                    resolve(
                        reader.result
                    );

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Unable to read the selected photo."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

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
            ------------------------------------------------
            Prevent accidental double submission
            ------------------------------------------------
            */

            if (
                submitButton &&
                submitButton.disabled
            ) {

                return;

            }


            /*
            ------------------------------------------------
            Browser validation
            ------------------------------------------------
            */

            if (
                !form.checkValidity()
            ) {

                form.reportValidity();

                return;

            }


            /*
            ------------------------------------------------
            Internet connection
            ------------------------------------------------
            */

            if (
                !navigator.onLine
            ) {

                showStatus(
                    "You appear to be offline. Please reconnect and try again.",
                    "error"
                );

                return;

            }


            /*
            ------------------------------------------------
            Validate Apps Script URL
            ------------------------------------------------
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
            ------------------------------------------------
            Disable submit button
            ------------------------------------------------
            */

            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Preparing...";

                submitButton.style.opacity =
                    "0.7";

            }


            showStatus(
                "Preparing visit record...",
                "info"
            );


            /*
            =================================================
            COLLECT NORMAL FORM DATA
            =================================================
            */

            const formData =
                new FormData(form);


            /*
            =================================================
            CREATE URLSearchParams
            =================================================

            We intentionally do NOT send the original
            multipart FormData.

            Instead, we create a normal text payload.

            This makes the request compatible with the
            Apps Script backend.
            =================================================
            */

            const payload =
                new URLSearchParams();


            /*
            -------------------------------------------------
            NORMAL FORM FIELDS
            -------------------------------------------------
            */

            payload.append(
                "beneficiary",
                formData.get("beneficiary") || ""
            );


            payload.append(
                "bathroom",
                formData.get("bathroom") || ""
            );


            payload.append(
                "mobility",
                formData.get("mobility") || ""
            );


            payload.append(
                "meals",
                formData.get("meals") || ""
            );


            payload.append(
                "laundry",
                formData.get("laundry") || ""
            );


            payload.append(
                "housekeeping",
                formData.get("housekeeping") || ""
            );


            payload.append(
                "medication",
                formData.get("medication") || ""
            );


            payload.append(
                "observation",
                formData.get("observation") || ""
            );


            payload.append(
                "visitDate",
                formData.get("visitDate") || ""
            );


            payload.append(
                "caregiver",
                formData.get("caregiver") || ""
            );


            payload.append(
                "supervisor",
                formData.get("supervisor") || ""
            );


            payload.append(
                "latitude",
                formData.get("latitude") || ""
            );


            payload.append(
                "longitude",
                formData.get("longitude") || ""
            );


            payload.append(
                "timestamp",
                formData.get("timestamp") || ""
            );


            /*
            =================================================
            PHOTO PROCESSING
            =================================================
            */

            let selectedFile =
                null;


            if (
                photo &&
                photo.files &&
                photo.files.length > 0
            ) {

                selectedFile =
                    photo.files[0];

            }


            /*
            -------------------------------------------------
            If photo exists, convert it to Base64
            -------------------------------------------------
            */

            if (selectedFile) {

                showStatus(
                    "Preparing photo...",
                    "info"
                );


                if (submitButton) {

                    submitButton.textContent =
                        "Preparing Photo...";

                }


                const photoBase64 =
                    await fileToBase64(
                        selectedFile
                    );


                /*
                ------------------------------------------------
                Send the exact field names expected by Code.gs
                ------------------------------------------------
                */

                payload.append(
                    "photoBase64",
                    photoBase64
                );


                payload.append(
                    "photoName",
                    selectedFile.name ||
                    "beneficiary_photo.jpg"
                );


                payload.append(
                    "photoType",
                    selectedFile.type ||
                    "image/jpeg"
                );


                console.log(
                    "Photo prepared successfully.",
                    {
                        name:
                            selectedFile.name,

                        type:
                            selectedFile.type,

                        size:
                            selectedFile.size
                    }
                );

            }

            else {

                /*
                ------------------------------------------------
                No photo selected.
                Send empty photo fields explicitly.
                ------------------------------------------------
                */

                payload.append(
                    "photoBase64",
                    ""
                );


                payload.append(
                    "photoName",
                    ""
                );


                payload.append(
                    "photoType",
                    ""
                );


                console.log(
                    "No photo was selected."
                );

            }


            /*
            =================================================
            TIMEOUT CONTROLLER
            =================================================
            */

            const controller =
                new AbortController();


            const timeout =
                setTimeout(
                    function () {

                        controller.abort();

                    },
                    60000
                );


            try {

                /*
                =================================================
                SEND REQUEST
                =================================================
                */

                showStatus(
                    "Submitting visit record...",
                    "info"
                );


                if (submitButton) {

                    submitButton.textContent =
                        "Submitting...";

                }


                const response =
                    await fetch(
                        SCRIPT_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/x-www-form-urlencoded;charset=UTF-8"
                            },

                            body:
                                payload.toString(),

                            signal:
                                controller.signal
                        }
                    );


                /*
                -------------------------------------------------
                Clear timeout
                -------------------------------------------------
                */

                clearTimeout(
                    timeout
                );


                /*
                -------------------------------------------------
                HTTP status
                -------------------------------------------------
                */

                if (
                    !response.ok
                ) {

                    throw new Error(
                        "Server returned HTTP " +
                        response.status
                    );

                }


                /*
                -------------------------------------------------
                Read server response
                -------------------------------------------------
                */

                const responseText =
                    await response.text();


                console.log(
                    "Apps Script response:",
                    responseText
                );


                /*
                -------------------------------------------------
                Parse JSON
                -------------------------------------------------
                */

                let result;


                try {

                    result =
                        JSON.parse(
                            responseText
                        );

                }

                catch (jsonError) {

                    console.error(
                        "Raw server response:",
                        responseText
                    );


                    throw new Error(
                        "Invalid response received from server."
                    );

                }


                /*
                =================================================
                SUCCESS
                =================================================
                */

                if (
                    result &&
                    result.success === true
                ) {

                    /*
                    ------------------------------------------------
                    Show success
                    ------------------------------------------------
                    */

                    if (
                        result.photoUploaded === true
                    ) {

                        showStatus(
                            "Visit submitted successfully. Photo uploaded.",
                            "success"
                        );

                    }

                    else {

                        showStatus(
                            "Visit submitted successfully.",
                            "success"
                        );

                    }


                    /*
                    ------------------------------------------------
                    Log important server information
                    ------------------------------------------------
                    */

                    console.log(
                        "Request ID:",
                        result.requestId
                    );


                    console.log(
                        "Photo URL:",
                        result.photoUrl
                    );


                    console.log(
                        "Photo uploaded:",
                        result.photoUploaded
                    );


                    /*
                    ------------------------------------------------
                    Reset form
                    ------------------------------------------------
                    */

                    form.reset();


                    /*
                    ------------------------------------------------
                    Hide preview
                    ------------------------------------------------
                    */

                    if (preview) {

                        preview.style.display =
                            "none";

                        preview.removeAttribute(
                            "src"
                        );

                    }


                    /*
                    ------------------------------------------------
                    Generate fresh timestamp
                    ------------------------------------------------
                    */

                    updateTimestamp();

                }

                /*
                =================================================
                DUPLICATE
                =================================================
                */

                else if (
                    result &&
                    result.duplicate === true
                ) {

                    showStatus(
                        result.message ||
                        "This visit appears to have already been submitted.",
                        "warning"
                    );


                    console.warn(
                        "Duplicate submission:",
                        result.requestId
                    );

                }

                /*
                =================================================
                SERVER ERROR
                =================================================
                */

                else {

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
                ------------------------------------------------
                Clear timeout
                ------------------------------------------------
                */

                clearTimeout(
                    timeout
                );


                /*
                ------------------------------------------------
                Timeout
                ------------------------------------------------
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
                ------------------------------------------------
                Network error
                ------------------------------------------------
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
                ------------------------------------------------
                Other errors
                ------------------------------------------------
                */

                else {

                    showStatus(
                        "Submission failed: " +
                        error.message,
                        "error"
                    );

                }


                /*
                ------------------------------------------------
                Technical log
                ------------------------------------------------
                */

                console.error(
                    "Submission error:",
                    error
                );

            }


            finally {

                /*
                ------------------------------------------------
                Always restore submit button
                ------------------------------------------------
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
```
