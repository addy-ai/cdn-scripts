let uid = null;
const ENDPOINT = "https://us-central1-hey-addy-chatgpt.cloudfunctions.net/api";

function createFeedbackForm() {
    // Style block
    const style = document.createElement('style');
    style.textContent = `
        .addy-feedback-form {
            font-family: Arial, Helvetica, sans-serif;
        }

        .reason-section {
            display: flex;
            flex-direction: column;
            gap: 5px;
            margin-top: 20px;
        }

        .reason-section input[type="radio"] {
            margin-right: 8px;
            width: 20px;
            height: 20px;
            margin-top: 0px;
            cursor: pointer;
        }

        .reason-section span {
            color: rgba(0, 0, 0, 0.8);
            cursor: pointer;
        }

        .details-section {
            margin-top: 20px;
        }

        .details-section textarea {
            width: 95%;
            height: 60px;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
            border-radius: 8px;
            resize: vertical;
            font-family: Arial, Helvetica, sans-serif;
            resize: none;
        }

        .addy-text-red-500 {
            color: #f44336;
        }

        .addy-feedback-question-title {
            font-size: 18px;
            margin-top: 25px;
        }

        .addy-feedback-submit-button {
            background-color: rgb(171, 131, 237);
            color: white;
            padding: 10px 20px;
            margin-top: 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
        }

        .addy-feedback-other-input {
            width: 95%;
            padding: 10px;
            border-radius: 5px;
            font-size: 17px;
            box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
            border: 1px solid rgba(0, 0, 0, 0.3);
        }
    `;
    document.head.appendChild(style);

    // Feedback form container
    const formContainer = document.createElement('div');
    formContainer.className = 'addy-feedback-form';
    formContainer.innerHTML = `
        <h2 style="font-weight: bold; font-size: 30px;">😔 It's sad to see you go</h2>
        <div style="font-size: 16px;">
            Please give us feedback so we can improve Addy AI
        </div>
        <div style="border-top: 0.5px solid rgba(0, 0, 0, 0.1); font-size: 14px; margin-top: 10px; padding-top: 10px;" class="addy-text-red-500">
            * Indicates required question
        </div>
        <form id="feedbackForm">
            <p class="addy-feedback-question-title">Why did you uninstall Addy Chrome Extension? <mark class="addy-text-red-500" style="background: transparent;">*</mark></p>
            <div class="reason-section">
                <!-- Radio buttons inserted here -->
            </div>
            <div id="addy-error-text" style="font-size: 15px; margin-top: 5px;" class="addy-text-red-500">
                
            </div>

            <p class="addy-feedback-question-title">Please share any specific details to help us improve. If you think the user interface is bad, please tell us why <mark style="background: transparent; color: red;">*</mark></p>
            <div class="details-section">
                
            </div>
            <button class="addy-feedback-submit-button" type="submit">
                Submit
            </button>
        </form>
    `;

    return formContainer;

}

function populateFormReasonsAndHandleInteractions() {
    const form = document.getElementById('feedbackForm');
    const reasonSection = document.querySelector('.reason-section');
    const detailsSection = document.querySelector('.details-section');
    const reasons = ['Poor email responses', "It's too slow", "I don't use Gmail", "Generated emails don't sound like me", "Too expensive", "Other"];
    let feedback = { reason: '', details: '', otherDetails: '' };

    // Handling change event
    const handleChange = (e) => {
        feedback = { ...feedback, [e.target.name]: e.target.value };

        if (e.target.value !== 'other') {
            console.log('Other input value:', e.target.value);
            otherInput.style.display = 'none';
        } else {
            otherInput.style.display = 'block';
            console.log('Other input value:', e.target.value);
        }
    };

    // Other text area 
    const otherInput = document.createElement('input');
    otherInput.type = 'text';
    otherInput.className = "addy-feedback-other-input";
    otherInput.placeholder = "Please specify";
    otherInput.style.display = 'none'; // Initially hidden

    otherInput.addEventListener('change', (e) => {
        feedback = { ...feedback, otherDetails: e.target.value };
    });

    // Populate Reasons
    reasons.forEach((reason, index) => {
        const container = document.createElement('div');
        container.style = 'display: flex; align-items: center; margin-bottom: 10px;';
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'reason';
        input.value = reason.toLowerCase();
        input.addEventListener('change', handleChange);

        const span = document.createElement('span');
        span.textContent = reason;

        span.addEventListener('click', function () {
            input.click();
        });

        container.appendChild(input);
        container.appendChild(span);
        reasonSection.appendChild(container);
    });

    reasonSection.appendChild(otherInput); // Add the other input field at the end

    // Details Textarea
    const detailsTextarea = document.createElement('textarea');
    detailsTextarea.name = 'details';
    detailsTextarea.addEventListener('change', handleChange);
    detailsSection.appendChild(detailsTextarea);

    // Submit Event
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!feedback.reason) {
            showAndHideErrorText("Please select a reason for uninstalling");
            return;
        }

        if (feedback.reason === 'other' && feedback.otherDetails.trim() === '') {
            showAndHideErrorText("Please specify your reason");
            return;
        }

        console.log('Submitted feedback:', feedback);
        submitFeedback(feedback);
    });
}

function showAndHideErrorText(text) {
    const errorText = document.getElementById('addy-error-text');
    // Show the error text
    errorText.textContent = text;
    // Hide the error text after 7 seconds
    setTimeout(() => {
        errorText.textContent = '';
    }, 7000);
}

function submitFeedback(feedback) {
    // fetch
    fetch(`${ENDPOINT}/user/feedback`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            feedback: feedback,
            uid: uid
        }),
    })
        .then((response) => response.json())
        .then((response) => {
            if (response.success) {
                // Show the success responses
                alert("Thank you for your feedback. We will use it to improve Addy AI");
            }
            // Not successful
            alert("Sorry something went wrong. Please try again");
        })
        .catch((error) => {
            alert("Sorry something went wrong. Please try again");
        });

}



document.addEventListener('DOMContentLoaded', function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const visitSource = urlParams.get("src");

    let formattedVisitSource = visitSource == null ? "unknown" : visitSource;
    formattedVisitSource = formattedVisitSource.replaceAll(/\.|#|\$|[|]/g, ""); // replace illegal characters

    uid = formattedVisitSource;

    const feedbackForm = createFeedbackForm();

    // Append the feedback form to the container
    const feedbackFormContainer = document.querySelector(".addy-feedback-form-container");
    feedbackFormContainer.appendChild(feedbackForm);

    // Populate Reason, and handle interactions like clicking, etc
    populateFormReasonsAndHandleInteractions();
});