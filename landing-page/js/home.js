/**
 * Javascript methods for Home page on Landing page
 */

window.addEventListener("load", function () {

    triggerBottomRequestAccessProcedure();

});

/**
 * Request Access Procedure
 */
const REQUEST_ACCESS_API_ENDPOINT = "";


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
    button.style.right = "5px";
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
            onRequestAccessPressed(emailInput.value);
        });

        // Add enter key Event Listener to the Email Input Field
        emailInput.addEventListener('keydown', function (event) {
            if (event.keyCode === 13) { // Check if 'Enter' was pressed
                event.preventDefault();
                onRequestAccessPressed(emailInput.value);
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
async function onRequestAccessPressed(email) {
    if (!(email && email.length > 3)) {
        // Email is less than 3 characters. invalid email error
        return;
    }
    // Emil exists and is over 3 characters
    const requestAccess = await callRequestAccessAPI(email);
    let message = requestAccess.message;
    if (requestAccess && requestAccess.success) {
        // Show success pop up
        message = message || "Successful"; // Default to successful if message is undefined
        showSuccessPopUp(message);
    } else {
        // Show error pop up
        message = message || "Something went wrong";
        showErrorPopUp(message);
    }
}

/**
 * 
 * @param {String} email 
 * @return {Objet} An Object containing a success boolean and a message
 */
async function callRequestAccessAPI(email) {
    return await fetch(REQUEST_ACCESS_API_ENDPOINT, {
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
                console.log(message);
                return {
                    "success": true,
                    "message": message,
                }
            } else {
                throw new Error(message);
            }
        }).catch((error) => {
            console.error('Error:', error);
            return {
                "success": false,
                "message": error,
            };
        });
}

/**
 * @desc Displays a success pop up on the page
 * @param {String} message 
 */
function showSuccessPopUp(message) {

}

/**
 * @des Displays an error pop up on the page
 * @param {String} message 
 */
function showErrorPopUp(message) {

}