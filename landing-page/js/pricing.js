function redirectToUtilsRoute() {
    // Get current page's url
    var currentUrl = window.location.href;

    // Split current location by "/pricing"
    var urlParts = currentUrl.split("/pricing");
    // Get the second part of the split
    var secondPart = urlParts[1];
    const newFirstPart = "https://utils.addy.so/pricing";
    // Construct new url
    var newUrl = newFirstPart + secondPart;
    // Redirect to new url
    window.location.href = newUrl;
}

// DOM content loaded
document.addEventListener("DOMContentLoaded", function () {
    // redirect to utils route
    redirectToUtilsRoute();
});