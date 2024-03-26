function redirectToUtilsRoute() {
    // Get current page's url
    var currentUrl = window.location.href;

    // Create a new URL object
    var url = new URL(currentUrl);

    // Replace 'addy' with 'utils' in hostname
    var newHost = url.hostname.replace('addy', 'utils');

    // Construct new url considering all parts of the current URL
    var newUrl = url.protocol + "//" +
        (url.username ? url.username + (url.password ? ":" + url.password : "") + "@" : "") +
        newHost +
        (url.port ? ":" + url.port : "") +
        url.pathname +
        (url.search ? url.search : "") +
        (url.hash ? url.hash : "");

    // Redirect to new url
    window.location.href = newUrl;
}

// DOM content loaded
document.addEventListener("DOMContentLoaded", function () {
    // redirect to utils route
    redirectToUtilsRoute();
});