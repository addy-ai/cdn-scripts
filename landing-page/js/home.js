/**
 * Javascript methods for Home page on Landing page
 */

window.addEventListener("load", function () {

    triggerBottomRequestAccessProcedure();

});

/**
 * Request Access Procedure
 */
const ENDPOINT = "https://us-central1-hey-addy-chatgpt.cloudfunctions.net/api";
let popUpShown = false;

function updateStylesForButtomRequestAccessView(input, button) {

    if (!(input && button)) return;
    // Both input and button exist
    // Get height of input button
    const inputHeight = input.offsetHeight;
    // Add styles to the input
    input.style.position = "absolute";
    input.style.zIndex = "999";
    input.style.color = "rgba(255, 255, 255, 1)";

    // Add styles to the button
    button.style.position = "absolute";
    button.style.zIndex = "9999";
    button.style.border = "1px solid transparent";
    button.style.right = "1px";
    // Make button height 84% of the input height
    button.style.height = `${inputHeight * 0.84}px`;

}

function triggerBottomRequestAccessProcedure() {
    // Fetching DOM elements
    const requestAccessButtons = document.querySelectorAll(".addy-request-access-button");
    // For all request access buttons, apply the on click listener to it
    if (requestAccessButtons && requestAccessButtons.length) {
        requestAccessButtons.forEach((button) => {
            button.addEventListener("click", () => {
                // What happens when the button is clicked

            });
        });
    } else {
        // TODO: Log this error, and alert team if needed
    }

    // The bottom sections request Access
    const bottomRequestAccessSection = document.querySelector(".addy-request-access-bottom-div");
    if (bottomRequestAccessSection) {
        // Find the form input
        bottomSectionRequestAccessProcedure(bottomRequestAccessSection);
    } else {
        // TODO: Log this error, and alert team if needed
    }

}


function bottomSectionRequestAccessProcedure(bottomSection) {
    try {
        const requestAccessForm = bottomSection.querySelector("form");
        if (!requestAccessForm) throw new Error("RequestAccessForIsUndefined");
        // Form exists, find the input element and button
        const emailInput = requestAccessForm.querySelector('input[type="email"][name="email"]');
        if (!emailInput) throw new Error("EmailInputIsUndefined");

        // Find the submit input element
        const submitButton = requestAccessForm.querySelector('input[type="submit"]');
        if (!submitButton) throw new Error("SubmitButtonIsUndefined");

        // Both email input and submit button exist
        // Update styles for the input and button
        updateStylesForButtomRequestAccessView(emailInput, submitButton);

        // Add Click Event Listener to the Submit Button
        submitButton.addEventListener('click', function (event) {
            event.preventDefault();
            onRequestAccessPressed(emailInput.value, submitButton);
        });

        // Add enter key Event Listener to the Email Input Field
        emailInput.addEventListener('keydown', function (event) {
            if (event.keyCode === 13) { // Check if 'Enter' was pressed
                event.preventDefault();
                onRequestAccessPressed(emailInput.value, submitButton);
            }
        });


    } catch (error) {
        // TODO: Log this error or alert the team if needed
    }

}


/**
 * @desc Defines what happen when request access button in clicked
 * @param {String} email
 */
async function onRequestAccessPressed(email, button) {
    if (!(email && email.length > 3)) {
        // Email is less than 3 characters.
        // TODO: invalid email error
        return;
    }
    // Emil exists and is over 3 characters
    // Add feedback to button. Disable button and change text to "Requesting..."
    const orginalButtonText = button.value;
    button.disabled = true;
    button.value = "Requesting...";
    // Call the request access API
    const requestAccess = await callRequestAccessAPI(email);
    // Reset the button
    button.disabled = false;
    button.value = orginalButtonText;
    // Check if request access was successful
    let message = requestAccess.message;
    if (requestAccess && requestAccess.success) {
        // Show success pop up
        message = message || "Successful"; // Default to successful if message is undefined
        showPopUp(message);
    } else {
        // Show error pop up
        message = message || "Something went wrong";
        showPopUp(message);
    }
}

/**
 * 
 * @param {String} email 
 * @return {Objet} An Object containing a success boolean and a message
 */
async function callRequestAccessAPI(email) {
    return await fetch(`${ENDPOINT}/user/request-access`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "email": email })
    })
        .then(response => response.json())
        .then(data => {
            const message = data.message;
            if (data.success) {
                return {
                    "success": true,
                    "message": message,
                }
            } else {
                throw new Error(message);
            }
        }).catch((error) => {
            return {
                "success": false,
                "message": error,
            };
        });
}

/**
 * @desc Displays a pop up on the page
 * @param {String} message 
 */
function showPopUp(message) {
    // Show simple alert for now
    const middleText = getMiddleMessage(message);
    const buttonText = getButtonText(message);
    showModal(message, middleText, buttonText);
}

function getMiddleMessage(message) {
    if (!message) return "";
    // convert to lower case
    if (message.toLowerCase().includes("invalid email")) {
        return "Please enter a valid email address";
    } else if (message.toLowerCase().includes("something went wrong")) {
        return "Please try again later";
    } else {
        return `We'll be in touch soon. In the meantime, <a href="https://chromewebstore.google.com/detail/addy-ai-chatgpt-email-ass/gldadickgmgciakdljkcpbdepehlilfn" target="_blank" style="font-weight: bold; text-decoration: underline; color: #4A4B5B;">download the Addy Chrome Extension<a/> to get a glimpse of what's coming.`;
    }
}

function getButtonText(message) {
    if (!message) return "Close";
    // convert to lower case
    if (message.toLowerCase().includes("invalid email")) {
        return "Try Again";
    } else if (message.toLowerCase().includes("something went wrong")) {
        return "Try Again";
    } else {
        return "Close";
    }
}

async function showModal(message, middleText, buttonText) {
    // Set the onboarding to be completed

    if (popUpShown) return;

    const shareDiv = document.createElement("div");
    shareDiv.style.width = "420px";
    shareDiv.style.height = "fit-content";
    shareDiv.style.justifyContent = "center";
    shareDiv.style.alignItems = "center";
    shareDiv.style.position = "fixed";
    shareDiv.style.right = "0";
    shareDiv.style.left = "0";
    shareDiv.style.bottom = "0";
    shareDiv.style.top = "0";
    shareDiv.style.margin = "auto";
    shareDiv.style.zIndex = "99999";
    shareDiv.style.display = "block";
    shareDiv.style.padding = "20px";

   
    shareDiv.innerHTML = modalHTML(message, buttonText, middleText);
    
    const hidePage = document.createElement("div");
    hidePage.style.position = "fixed";
    hidePage.style.zIndex = "9999";
    hidePage.style.width = "100vw";
    hidePage.style.height = "100vh";
    hidePage.style.right = "0";
    hidePage.style.left = "0";
    hidePage.style.bottom = "0";
    hidePage.style.top = "0";
    hidePage.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    hidePage.style.backdropFilter = "blur(5px)";
    hidePage.style.display = "flex";
    hidePage.style.justifyContent = "center";
    hidePage.style.alignItems = "center";


    document.body.append(hidePage); // Hide the entire view. only show the share
    document.body.append(shareDiv);

    function onClosePopupModalClick(overlay, container) {

        if (overlay && container) {
            overlay.remove();
            container.remove();
        }
    }
    // Get buttons to close
    const closeModalX = document.getElementById("addy-modal-x-out");
    const closeModalButton = document.getElementById("addy-modal-confirmation-button");
    const closeButtons = [closeModalX, closeModalButton];
    for (let i = 0; i < closeButtons.length; i++) {
        if (closeButtons[i]) {
            closeButtons[i].addEventListener("click", async () => {
                onClosePopupModalClick(hidePage, shareDiv);
                popUpShown = false;
            });
        }
    }
    
    popUpShown = true;

}

function modalHTML(message, buttonText, middleText) {
    return `
    <div style="width: 300px; background-color: #FFFFFF; border-radius: 15px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <div style="width: 100%; display: flex; flex-direction: row; justify-content: space-between;">
        <div>
            <p style="color: #333333; font-size: 17px; font-weight: bold; margin-bottom: 10px;">
            ${message}
        </p>
        </div>
        <div id="addy-modal-x-out" style="cursor: pointer; width: fit-content; height: fit-content; padding: 5px">
            <img src="https://i.imgur.com/RWLar5E.png" width="12" height="12"/>
            
        </div>
        </div>
        
        <p style="color: #555555; font-size: 12px; margin-bottom: 20px;">
            ${middleText}
        </p>
        <button id="addy-modal-confirmation-button" style="width: 100%; background-color: #AB83EC; color: #FFFFFF; border: none; padding: 10px; border-radius: 20px; font-size: 14px; cursor: pointer;">
            ${buttonText}
        </button>
    </div>`
}