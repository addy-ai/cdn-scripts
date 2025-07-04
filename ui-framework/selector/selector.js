function selector({ question, label="", options = [], primaryColor = "#745DDE" }) {
    const optionsHtml = options
      .map(option => `
        <div class="option" data-value="${option}">
          ${option}
        </div>
      `)
      .join("");
  
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            font-family: Inter, sans-serif;
            margin: 0;
            padding: 16px;
          }
          .selector-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .selector-label {
            font-size: 14px;
            font-weight: 500;
            color: #4B5563;
          }
          .selector-options {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .option {
            padding: 15px 15px;
            background-color: #F3F4F6;
            border: 2px solid transparent;
            border-radius: 15px;
            font-size: 18px;
            width: 90%;
            cursor: pointer;
            transition: background-color 0.2s, border-color 0.2s;
          }
          .option:hover {
            background-color: #E5E7EB;
          }
          .option.selected {
            border-color: {{primaryColor}};
            background-color: #F3F4F6;
          }
        </style>
      </head>
      <body>
        <div class="selector-container">
          <p class="selector-label">{{label}}</p>
          <div class="selector-options">
            {{optionsHtml}}
          </div>
        </div>
        <script>
          function handleOptionClick(event) {
            if (event.target.classList.contains('option')) {
              document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
              });
              event.target.classList.add('selected');
              const selectedValue = event.target.getAttribute('data-value');
              updateAnswer(selectedValue);
            }
          }
  
          function updateAnswer(answer) {
            const messageToSend = {
              question: "{{question}}",
              answer: answer
            };
            window.parent.postMessage({ answerSelected: messageToSend }, "*");
          }
  
          document.addEventListener('DOMContentLoaded', function () {
            document.querySelector('.selector-options').addEventListener('click', handleOptionClick);
          });
        </script>
      </body>
      </html>
    `;
  
    html = html
      .replaceAll("{{label}}", label)
      .replaceAll("{{question}}", question)
      .replaceAll("{{optionsHtml}}", optionsHtml)
      .replaceAll("{{primaryColor}}", primaryColor);
    return html;
  }
  