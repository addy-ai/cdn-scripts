window.addEventListener("load", function () {

    // Report conversions to Google Ads
    reportConversionsToGoogleAds();

});

function reportConversionsToGoogleAds() {
    const bookDemoURL = "https://calendar.app.google/U3vBcoNXpkF7WiDFA";
    const bookDemoButtons = document.querySelectorAll(`a[href="${bookDemoURL}"]`);

    bookDemoButtons.forEach(function (button) {
        button.addEventListener("click", () => {
            try {
                gtag_report_conversion_book_demo();
            } catch (error) {
                console.error(error);
            }
            
        });
    });
}

