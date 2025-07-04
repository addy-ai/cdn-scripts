function slider({
    question,
    label="",
    min = 0,
    max = 100,
    defaultValue = 50,
    step = 1,
    unit = "$",
    unitPlacement = "front",
    primaryColor = "#10B981"
  }) {
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
              background-color: #fff;
            }
            .slider-container {
              display: flex;
              flex-direction: column;
              gap: 25px;
              max-width: 90%;
            }
            .slider-label {
              font-size: 14px;
              font-weight: 500;
              color: #4B5563;
            }
            .slider-value {
              font-size: 24px;
              font-weight: 600;
              color: #111827;
              text-align: center;
            }
            .range-wrapper {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .range-min,
            .range-max {
              min-width: 40px;
            }
            /* Base slider styling */
            input[type="range"] {
              -webkit-appearance: none;
              width: 100%;
              height: 6px;
              border-radius: 3px;
              outline: none;
              margin: 0 8px;
              cursor: pointer;
              background: #E5E7EB; /* fallback if JS hasn't updated fill yet */
            }
            /* For Chrome/Safari/Edge */
            input[type="range"]::-webkit-slider-runnable-track {
              height: 6px;
              border-radius: 3px;
              background: transparent; /* let JS handle the dynamic fill */
            }
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              height: 30px;
              width: 30px;
              background: #fff;
              border-radius: 50%;
              margin-top: -13px;
              background: {{primaryColor}};
            }
            /* For Firefox */
            input[type="range"]::-moz-range-track {
              height: 6px;
              border-radius: 3px;
              background: transparent;
            }
            input[type="range"]::-moz-range-thumb {
              height: 20px;
              width: 20px;
              background: #fff;
              border: 2px solid #111827;
              border-radius: 50%;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="slider-container">
            <label class="slider-label">{{label}}</label>
            <div class="slider-value" id="sliderValue"></div>
            <div class="range-wrapper">
              <div class="range-min" id="rangeMin"></div>
              <input
                type="range"
                id="sliderInput"
                min="{{min}}"
                max="{{max}}"
                value="{{defaultValue}}"
                step="{{step}}"
              />
              <div class="range-max" id="rangeMax"></div>
            </div>
          </div>
  
          <script>
            function formatValue(rawValue) {
              const value = Number(rawValue);
              return ("{{unitPlacement}}" === "front")
                ? "{{unit}}" + value.toLocaleString()
                : value.toLocaleString() + "{{unit}}";
            }
  
            function updateSliderFill(slider) {
              const minVal = Number(slider.min);
              const maxVal = Number(slider.max);
              const val = Number(slider.value);
              const percentage = ((val - minVal) / (maxVal - minVal)) * 100;
  
              // Create a two-tone track with the "filled" color and the remaining color
              slider.style.background =
                "linear-gradient(to right, {{primaryColor}} 0%, {{primaryColor}} "
                + percentage + "%, #E5E7EB " + percentage + "%, #E5E7EB 100%)";
            }
  
            function handleSliderChange(event) {
              const sliderValue = event.target.value;
              displayValue(sliderValue);
              updateSliderFill(event.target);
              updateAnswer(sliderValue);
            }
  
            function displayValue(value) {
              document.getElementById('sliderValue').innerText = formatValue(value);
            }
  
            function updateAnswer(answer) {
              const messageToSend = {
                question: "{{question}}",
                answer: answer
              };
              window.parent.postMessage({ answerSelected: messageToSend }, "*");
            }
  
            document.addEventListener('DOMContentLoaded', function() {
              const sliderInput = document.getElementById('sliderInput');
              const rangeMin = document.getElementById('rangeMin');
              const rangeMax = document.getElementById('rangeMax');
  
              // Initial fill and value
              displayValue(sliderInput.value);
              updateSliderFill(sliderInput);
  
              // Set min and max labels
              rangeMin.innerText = formatValue("{{min}}");
              rangeMax.innerText = formatValue("{{max}}") + "+";
  
              sliderInput.addEventListener('input', handleSliderChange);
            });
          </script>
        </body>
      </html>
    `;
  
    // Replace placeholders
    html = html
      .replaceAll("{{question}}", question)
      .replaceAll("{{label}}", label)
      .replaceAll("{{min}}", min)
      .replaceAll("{{max}}", max)
      .replaceAll("{{defaultValue}}", defaultValue)
      .replaceAll("{{step}}", step)
      .replaceAll("{{unit}}", unit)
      .replaceAll("{{unitPlacement}}", unitPlacement)
      .replaceAll("{{primaryColor}}", primaryColor);
  
    return html;
  }
  