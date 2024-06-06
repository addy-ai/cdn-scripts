window.addEventListener("load", function () {

    // Report conversions to Google Ads
    reportConversionsToGoogleAds();

});

function reportConversionsToGoogleAds() {
    const chromeExtensionURL = "https://chromewebstore.google.com/detail/addy-ai-chatgpt-email-ass/gldadickgmgciakdljkcpbdepehlilfn";
    const downloadExtensionButtons = document.querySelectorAll(`a[href="${chromeExtensionURL}"]`);

    downloadExtensionButtons.forEach(function (button) {
        button.addEventListener("click", () => {
            try {
                gtag_report_conversion();
            } catch (error) {
                console.error(error);
            }
            
        });
    });
}

