window.addEventListener("load", function () {

    // Report conversions to Google Ads
    console.log("Window loaded");
    reportConversionsToGoogleAds();

});

function reportConversionsToGoogleAds() {
    console.log("Report conversions to google ads init")
    const bookDemoURL = "https://calendar.app.google/U3vBcoNXpkF7WiDFA";
    const bookDemoButtons = document.querySelectorAll(`a[href="${bookDemoURL}"]`);

    bookDemoButtons.forEach(function (button) {
        console.log("Init button click");
        button.addEventListener("click", () => {
            try {
                console.log("Button clicked, calling gtag_report_conversion_book_demo");
                gtag_report_conversion_book_demo();
            } catch (error) {
                console.error(error);
            }
            
        });
    });
}
