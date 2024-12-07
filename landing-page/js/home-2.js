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


function handleTestimonialVideo() {
    const playButton = document.getElementById("home-testimonial-play-button");
    const thumbnail = document.getElementById("home-testimonial-thumbnail");

    if (playButton) {
        playButton.addEventListener("click", togglePlayTestimonialVideo)
    }

    if (thumbnail) {
        thumbnail.addEventListener("click", togglePlayTestimonialVideo)
    }
}

function togglePlayTestimonialVideo(playButton, thumbnail) {
    // hide the two elements
    playButton.style.display = "none";
    thumbnail.style.display = "none";

    var style = document.createElement('style');

    // Add CSS rules for hiding the play button and thumbnail
    style.innerHTML = '#home-testimonial-play-button, #home-testimonial-thumbnail { display: none; }';
    document.head.appendChild(style);

    // get the video element
    var video = document.querySelector("#home-testimonial-video video");

    // enable the controls and start playing the video
    if (video) {
      video.controls = true;
      video.muted = false;
      video.play();
    } else {
      console.warn("Could not find a video element in #home-testimonial-video");
    }
}

