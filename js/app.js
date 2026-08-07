
/*
===========================================
Senior Care Visit Management System
app.js
Author: Gabriel West
===========================================
*/

//====================================================
// CONFIGURATION
//====================================================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyJt_7DPBjDjqtpuf9OpryG4yANSC7m07kQuVU6kc7CUsfURAdDXWVPdHJDE5PwlL80/exec";

//====================================================
// DOM ELEMENTS
//====================================================

const form = document.getElementById("visitForm");
const photo = document.getElementById("photo");
const preview = document.getElementById("preview");
const status = document.getElementById("status");
const submitButton = form.querySelector("button[type='submit']");

const latitude = document.getElementById("latitude");
const longitude = document.getElementById("longitude");
const timestamp = document.getElementById("timestamp");

//====================================================
// INITIALIZATION
//====================================================

document.addEventListener("DOMContentLoaded", init);

function init() {

    setTimestamp();

    getCurrentLocation();

    setupCameraPreview();

}

//====================================================
// TIMESTAMP
//====================================================

function setTimestamp(){

    timestamp.value = new Date().toISOString();

}

//====================================================
// GPS
//====================================================

function getCurrentLocation(){

    if(!navigator.geolocation){

        console.warn("Geolocation not supported.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        function(position){

            latitude.value = position.coords.latitude;

            longitude.value = position.coords.longitude;

        },

        function(error){

            console.warn(error.message);

        },

        {

            enableHighAccuracy:true,

            timeout:10000,

            maximumAge:0

        }

    );

}

//====================================================
// CAMERA PREVIEW
//====================================================

function setupCameraPreview(){

    photo.addEventListener("change",function(){

        if(this.files.length===0){

            preview.style.display="none";

            return;

        }

        preview.src = URL.createObjectURL(this.files[0]);

        preview.style.display = "block";

    });

}

//====================================================
// FORM VALIDATION
//====================================================

function validateForm(){

    if(form.beneficiary.value.trim()===""){

        showMessage("Beneficiary name is required.","red");

        return false;

    }

    if(form.visitDate.value===""){

        showMessage("Visit date is required.","red");

        return false;

    }

    if(form.caregiver.value.trim()===""){

        showMessage("Caregiver name is required.","red");

        return false;

    }

    return true;

}

//====================================================
// SUBMIT
//====================================================

form.addEventListener("submit",submitForm);

function submitForm(e){

    e.preventDefault();

    if(!validateForm()) return;

    submitButton.disabled = true;

    submitButton.innerText = "Submitting...";

    showMessage("Uploading visit...","blue");

    const formData = new FormData(form);

    fetch(SCRIPT_URL,{

        method:"POST",

        body:formData

    })

    .then(response=>response.text())

    .then(result=>{

        console.log(result);

        showMessage("Visit submitted successfully.","green");

        resetForm();

    })

    .catch(error=>{

        console.error(error);

        showMessage("Unable to submit visit.","red");

    })

    .finally(()=>{

        submitButton.disabled=false;

        submitButton.innerText="Submit Visit";

    });

}

//====================================================
// RESET
//====================================================

function resetForm(){

    form.reset();

    preview.style.display="none";

    preview.removeAttribute("src");

    latitude.value="";

    longitude.value="";

    setTimestamp();

    getCurrentLocation();

}

//====================================================
// STATUS MESSAGE
//====================================================

function showMessage(message,color){

    status.innerHTML = message;

    status.style.color = color;

}

//====================================================
// OPTIONAL NETWORK CHECK
//====================================================

window.addEventListener("offline",function(){

    showMessage("You are offline.","orange");

});

window.addEventListener("online",function(){

    showMessage("Internet connection restored.","green");

});

//====================================================
// OPTIONAL AUTO DATE
//====================================================

const visitDateField = document.querySelector("input[name='visitDate']");

if(visitDateField){

    visitDateField.valueAsDate = new Date();

}
