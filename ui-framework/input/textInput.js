/**
 * @description A text input component. Used to get a text input from the user. It can be used to get number, text, email, etc.
 * @param {Object<{question: string, label: string, type: string, placeholder: string}>} param0 
 * @returns {string}
 */
function textInput({question, label="", type = "text", placeholder = ""}) {
    let html = `
        <!DOCTYPE html>
        <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Inter;
                    }

                    .text-input-container {
                        display: flex;
                        flex-direction: column;
                        margin-bottom: 16px;
                        border-radius: 50%;
                        gap: 5px;
                    }

                    .text-input-label {
                        margin-bottom: 4px;
                        color: #4B5563;
                        /* Slightly gray text */
                        font-size: 14px;
                        font-weight: 500;
                    }

                    .text-input-field {
                        width: 100%;
                        padding: 15px;
                        font-size: 18px;
                        border-radius: 15px !important;
                        box-sizing: border-box;
                        border: 2px solid transparent;
                        border-radius: 4px;
                        background-color: #EEF1F5
                    }
                </style>
            </head>

            <body>
                <div class="text-input-container">
                    <label for="" class="text-input-label">{{label}}</label>
                    <input type="{{type}}" id="textInput" class="text-input-field" placeholder="" />
                </div>

                <script>
                    function handleTextInputChange(event) {
                        const textValue = event.target.value;
                        updateAnswer(textValue);
                    }

                    function updateAnswer(answer) {
                        const messageToSend = {
                            question: "{{question}}",
                            answer: answer
                        };
                        window.parent.postMessage({"answerSelected": messageToSend}, "*");
                    }

                    document.addEventListener('DOMContentLoaded', function () {
                        const inputField = document.getElementById('textInput');
                        inputField.addEventListener('input', handleTextInputChange);
                    });
                </script>
            </body>

        </html>
    `

    // Replace {{question}} and {{label}} with the actual question and label
    html = html
        .replaceAll("{{question}}", question)
        .replaceAll("{{label}}", label)
        .replaceAll("{{type}}", type)
        .replaceAll("{{placeholder}}", placeholder);
    return html;
}