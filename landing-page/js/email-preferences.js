
// Function to apply basic styles to the page
let uid = "";
const ENDPOINT = "https://us-central1-hey-addy-chatgpt.cloudfunctions.net/api";

function applyBasicStyles() {
    const style = document.createElement('style');
    const css = `
        .unsubscribe-container {
            font-family: Arial, sans-serif;
            background-color: #fff;
            margin: 0 auto;
        }
        .checkbox-item {
            margin-bottom: 20px;
        }
        .checkbox-item input[type='checkbox'] {
            margin-right: 10px;
        }
        
        
        .checkbox-item label {
            font-weight: bold;
            margin-right: 5px;
        }
        .checkbox-item p {
            font-size: 14px;
            color: #666;
        }
        .cancel-button {
            border-style: solid;
            border-width: 1px;
            border-color: #AB83EC;
            background-color: transparent;
            color: #AB83EC;
        }
        button {
            padding: 10px 20px;
            margin: 5px;
            border: none;
            background-color: #AB83EC;
            color: white;
            cursor: pointer;
            border-radius: 20px;
        }
        button:hover {
            text-decoration: underline;
        }
        button:active {
            background-color: #397d35;
        }
    `;

    style.type = 'text/css';
    if (style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    document.head.appendChild(style);
}

// Function to create a checkbox element for each email kind
function createCheckbox(emailKind) {
    let checkboxWrapper = document.createElement('div');
    checkboxWrapper.classList.add('checkbox-item');

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = emailKind.id;
    checkbox.checked = emailPreferences[emailKind.id] || false;

    // Event listener to update emailPreferences when checkbox state changes
    checkbox.addEventListener('change', function () {
        emailPreferences[this.id] = this.checked;
    });

    let label = document.createElement('label');
    label.htmlFor = emailKind.id;
    label.textContent = emailKind.name;

    let description = document.createElement('p');
    description.textContent = emailKind.description;

    checkboxWrapper.appendChild(checkbox);
    checkboxWrapper.appendChild(label);
    checkboxWrapper.appendChild(description);

    return checkboxWrapper;
}

// Function to render the unsubscribe page with checkboxes
function renderUnsubscribePage(emailPreferences, emailKinds) {
    const container = document.createElement('div');
    container.classList.add('unsubscribe-container');

    emailKinds.forEach(emailKind => {
        container.appendChild(createCheckbox(emailKind));
    });

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save preferences';
    // Event listener to print out emailPreferences when Save is clicked
    saveButton.addEventListener('click', async function () {
        console.log(emailPreferences);
        // Call updateEmailPreferences to update email preferences
        // Change button text to Saving while request is being processed
        saveButton.textContent = 'Saving...';
        const previousButtonText = saveButton.textContent;
        await updateEmailPreferences(uid, emailPreferences);
        saveButton.textContent = previousButtonText;
    });

    const cancelButton = document.createElement('button');
    cancelButton.setAttribute("class", "cancel-button");
    cancelButton.textContent = 'Cancel';
    // When cancel button is pressed go to "/" route
    cancelButton.addEventListener('click', function () {
        window.location.href = "/";
    });

    container.appendChild(cancelButton);
    container.appendChild(saveButton);

    return container;
}

async function getUsersEmailPreferences(uid) {
    // Fetch request to endpoint
    return await fetch(`${ENDPOINT}/user/email-preferences?uid=${uid}`)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log('Error:', error);
            return false;
        });
}

async function updateEmailPreferences(uid, emailPreferences) {
    // Fetch request to endpoint
    return await fetch(`${ENDPOINT}/user/email-preferences`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            uid: uid,
            updatedPreferences: emailPreferences,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                return true
            } else {
                alert(data.message || 'Sorry something went wrong. Please try again');
                return false;
            }
        })
        .catch(error => {
            console.log('Error:', error);
            alert(data.message || 'Sorry something went wrong. Please try again');
            return false;
        });
}

// When window is loaded
window.onload = async function () {
    // Get uid from URL params
    const urlParams = new URLSearchParams(window.location.search);
    uid = urlParams.get('uid')
    if (!uid) {
        return;
    }
    // UID exists
    // Apply basic styles to the page
    applyBasicStyles();
    // Get user's email preferences
    const emailPreferences = await getUsersEmailPreferences(uid);
    if (!emailPreferences) {
        // Handle error
        console.log('Error fetching email preferences');
        return;
    }

    // Call renderUnsubscribePage to build the page
    const unsubscribeContainer = renderUnsubscribePage(emailPreferences["emailPreferences"],
        emailPreferences["emailKinds"]);
    const unsubscribeParent = document.querySelector(".addy-email-preferences-container");
    if (unsubscribeParent) {
        unsubscribeParent.appendChild(unsubscribeContainer);
    }
};