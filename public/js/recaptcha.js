document.getElementById("formBtn").disabled = true;
document.getElementById("formBtn").setAttribute("recaptcha-false");

function enableBtn() {
    document.getElementById("formBtn").disabled = false;
    document.getElementById("formBtn").setAttribute("recaptcha-true");
}