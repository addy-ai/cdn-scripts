function redirectToUtilsRoute() {
    // Construct new url
    var newUrl = "https://help.addy.so/docs/training/training-your-assistant";
    // Redirect to new url
    window.location.href = newUrl;
}

// DOM content loaded
document.addEventListener("DOMContentLoaded", function () {
    // redirect to utils route
    redirectToUtilsRoute();
});