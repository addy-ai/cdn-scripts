// A simple script that creates a consent form of the following format:

/**
 * First Name
 * Last Name
 * Email
 * Phone Number
 * Checkbox and text "I agree to receive loan status updates from Addy at the phone number or email I provided. Data rates may apply, and I can reply STOP to opt out."
 * With links to "Privacy Policy" and "Terms of Service"
 * Implement the necessary validations for the form and embed on the page in the div with id "consent-form"
 */

(function() {
    'use strict';

    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const contactId = urlParams.get('contactId');

    // Validate required parameters
    if (!contactId) {
        console.error('Missing required URL parameter: contactId');
        // Show error message to the user
        const formContainer = document.getElementById('consent-form');
        if (formContainer) {
            formContainer.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #e74c3c;">
                    <h3>Invalid Link</h3>
                    <p>This consent form link is missing required parameters. Please contact support.</p>
                </div>
            `;
        }
        return; // Stop execution
    }

    // Add contact info loading function
    async function loadContactInfo() {
        if (!contactId) {
            console.log('Missing contactId, skipping pre-population');
            return null;
        }
        
        try {
            const response = await fetch(
                `http://localhost:8080/api/user/contact-info?contactId=${contactId}`
            );
            
            if (!response.ok) {
                console.log('Contact not found or error loading contact info');
                return null;
            }
            
            const result = await response.json();
            if (result.success && result.data) {
                return result.data;
            }
            
            return null;
        } catch (error) {
            console.error('Error loading contact info:', error);
            return null;
        }
    }

    // Form validation functions
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    function validateRequired(value) {
        return value.trim().length > 0;
    }

    function showError(element, message) {
        const errorDiv = element.parentNode.querySelector('.error-message') || 
                        document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '4px';
        
        if (!element.parentNode.querySelector('.error-message')) {
            element.parentNode.appendChild(errorDiv);
        }
        element.style.borderColor = '#e74c3c';
    }

    function clearError(element) {
        const errorDiv = element.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        element.style.borderColor = '#ddd';
    }

    // Create and inject the form
    async function createConsentForm() {
        const formContainer = document.getElementById('consent-form');
        if (!formContainer) {
            console.error('Consent form container not found');
            return;
        }

        // Load existing contact info
        const contactInfo = await loadContactInfo();

        const formHTML = `
            <div class="consent-form-wrapper">
                <form id="addy-consent-form" class="consent-form">
                    <h2 class="form-title">
                        Consent to Receive Text, SMS, and Telephone Communications Including AI-Assisted Technology
                        <span class="info-tooltip" title="By granting this consent, you authorize our organization to contact you via text message, SMS, or telephone, which may utilize AI-assisted technology, for the purpose of delivering service updates, account notifications, and other communications relevant to our relationship with you. Standard message and data rates may apply. You may revoke this consent at any time by following the opt-out instructions provided.">ℹ️</span>
                    </h2>
                    <div class="form-group">
                        <label for="firstName">First Name *</label>
                        <input type="text" id="firstName" name="firstName" required 
                               value="${contactInfo?.firstName || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label for="lastName">Last Name</label>
                        <input type="text" id="lastName" name="lastName"
                               value="${contactInfo?.lastName || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input type="email" id="email" name="email" required
                               value="${contactInfo?.email || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Phone Number *</label>
                        <input type="tel" id="phone" name="phone" required
                               value="${contactInfo?.phone || ''}">
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="consent" name="consent" required>
                            <span class="checkmark"></span>
                            <span class="consent-text">
                                I agree to receive automated SMS updates from Addy. Message frequency varies. Message & data rates may apply. Text STOP to opt-out.
                                <a href="/privacypolicy" target="_blank">Privacy Policy</a> and 
                                <a href="/termsofservice" target="_blank">Terms of Service</a>.
                            </span>
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <button type="submit" class="submit-btn">Submit</button>
                    </div>
                </form>
            </div>
        `;

        const formStyles = `
            <style>
                .consent-form-wrapper {
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .consent-form {
                    background: #fff;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                
                .form-title {
                    text-align: center;
                    color: #333;
                    margin-bottom: 25px;
                    font-size: 20px;
                    font-weight: 600;
                    line-height: 1.3;
                    position: relative;
                }
                
                .info-tooltip {
                    display: inline-block;
                    margin-left: 8px;
                    font-size: 16px;
                    color: #745dde;
                    cursor: help;
                    vertical-align: middle;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #333;
                }
                
                .form-group input[type="text"],
                .form-group input[type="email"],
                .form-group input[type="tel"] {
                    width: 100%;
                    padding: 15px;
                    font-size: 18px;
                    border-radius: 15px;
                    border: 2px solid transparent;
                    background-color: #EEF1F5;
                    transition: border-color 0.3s ease;
                    box-sizing: border-box;
                }
                
                .form-group input:focus {
                    outline: none;
                    border-color: #745dde;
                    box-shadow: 0 0 0 2px rgba(116,93,222,0.25);
                }
                
                .checkbox-group {
                    margin-top: 25px;
                }
                
                .checkbox-label {
                    display: flex;
                    align-items: flex-start;
                    cursor: pointer;
                    font-size: 14px;
                    line-height: 1.5;
                }
                
                .checkbox-label input[type="checkbox"] {
                    margin-right: 10px;
                    margin-top: 2px;
                    transform: scale(1.2);
                }
                
                .consent-text {
                    flex: 1;
                    color: #555;
                }
                
                .consent-text a {
                    color: #745dde;
                    text-decoration: none;
                }
                
                .consent-text a:hover {
                    text-decoration: underline;
                }
                
                .submit-btn {
                    width: 100%;
                    padding: 14px;
                    background: #745dde;
                    color: white;
                    border: none;
                    border-radius: 15px;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                
                .submit-btn:hover {
                    background: #5a47b8;
                }
                
                .submit-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
                
                .error-message {
                    color: #e74c3c;
                    font-size: 12px;
                    margin-top: 4px;
                }
                
                .success-message {
                    color: #27ae60;
                    font-size: 14px;
                    text-align: center;
                    padding: 15px;
                    background: #d4edda;
                    border: 1px solid #c3e6cb;
                    border-radius: 4px;
                    margin-top: 20px;
                }
            </style>
        `;

        // Inject styles
        if (!document.querySelector('#consent-form-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'consent-form-styles';
            styleElement.textContent = formStyles;
            document.head.appendChild(styleElement);
        }

        // Inject form
        formContainer.innerHTML = formHTML;

        // Add event listeners
        const form = document.getElementById('addy-consent-form');
        const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
        const checkbox = document.getElementById('consent');
        const submitBtn = form.querySelector('.submit-btn');

        /* ------------------- Dynamic Consent Flow ------------------- */
        const consentFlowHTML = `
            <div class="form-group">
                <label>Do we have consent to contact you via Call, Text or Email? *</label>
                <div class="inline-radio">
                    <label><input type="radio" name="globalConsent" value="yes" checked> Yes</label>
                    <label><input type="radio" name="globalConsent" value="no"> No</label>
                </div>
            </div>

            <div class="form-group" id="individualConsent" style="display:none;">
                <label>Please provide consent for each method *</label>

                <div class="channel-row">
                    <span>Call</span>
                    <div class="inline-radio">
                        <label><input type="radio" name="callConsent" value="yes"> Yes</label>
                        <label><input type="radio" name="callConsent" value="no" checked> No</label>
                    </div>
                </div>

                <div class="channel-row">
                    <span>Text</span>
                    <div class="inline-radio">
                        <label><input type="radio" name="textConsent" value="yes"> Yes</label>
                        <label><input type="radio" name="textConsent" value="no" checked> No</label>
                    </div>
                </div>

                <div class="channel-row">
                    <span>Email</span>
                    <div class="inline-radio">
                        <label><input type="radio" name="emailConsent" value="yes"> Yes</label>
                        <label><input type="radio" name="emailConsent" value="no" checked> No</label>
                    </div>
                </div>
            </div>

            <div class="form-group" id="preferredGroup">
                <label for="preferredContact">Preferred Contact Method *</label>
                <select id="preferredContact" name="preferredContact" required>
                    <option value="" disabled selected>Select...</option>
                    <option value="call">Call</option>
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                </select>
            </div>
        `;

        // Insert the consent flow before the checkbox group
        const checkboxGroup = form.querySelector('.checkbox-group');
        checkboxGroup.insertAdjacentHTML('beforebegin', consentFlowHTML);

        // Extra styles for the new elements
        if (!document.querySelector('#consent-flow-extra-styles')) {
            const extraStyle = document.createElement('style');
            extraStyle.id = 'consent-flow-extra-styles';
            extraStyle.textContent = `
                .inline-radio label {
                    margin-right: 15px;
                    cursor: pointer;
                }
                .channel-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #eee;
                }
                .channel-row:last-child {
                    border-bottom: none;
                }
                #preferredContact {
                    width: 100%;
                    padding: 15px;
                    font-size: 18px;
                    border-radius: 15px;
                    border: 2px solid transparent;
                    background-color: #EEF1F5;
                    box-sizing: border-box;
                }
            `;
            document.head.appendChild(extraStyle);

            // Toggle switch base styles
            if (!document.querySelector('#toggle-switch-styles')) {
                const toggleStyle = document.createElement('style');
                toggleStyle.id = 'toggle-switch-styles';
                toggleStyle.textContent = `
                    .switch { position: relative; display: inline-block; width: 46px; height: 24px; }
                    .switch input { opacity: 0; width: 0; height: 0; }
                    .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: #d1d5db; transition: 0.4s; border-radius: 34px; }
                    .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 2px; bottom: 2px; background: #fff; transition: 0.4s; border-radius: 50%; }
                    .switch input:checked + .slider { background: #111827; }
                    .switch input:checked + .slider:before { transform: translateX(22px); }
                `;
                document.head.appendChild(toggleStyle);
            }
        }

        // After insertion, grab references
        const globalConsentRadios = form.querySelectorAll('input[name="globalConsent"]');
        const individualConsentSection = document.getElementById('individualConsent');
        const individualConsentRadios = individualConsentSection.querySelectorAll('input[type="radio"]');
        const preferredGroup = document.getElementById('preferredGroup');
        const preferredSelect = document.getElementById('preferredContact');

        /* ---------- Initialize toggle switches to match theme ---------- */
        (function initToggles() {
            // Global toggle
            const globalYesRadio = form.querySelector('input[name="globalConsent"][value="yes"]');
            const globalNoRadio = form.querySelector('input[name="globalConsent"][value="no"]');
            const globalContainer = globalYesRadio.closest('.form-group');
            const globalToggleLabel = document.createElement('label');
            globalToggleLabel.className = 'switch';
            const globalToggle = document.createElement('input');
            globalToggle.type = 'checkbox';
            globalToggle.id = 'globalConsentToggle';
            globalToggle.name = 'globalConsentToggle';
            globalToggle.checked = globalYesRadio.checked;
            const globalSlider = document.createElement('span');
            globalSlider.className = 'slider';
            globalToggleLabel.appendChild(globalToggle);
            globalToggleLabel.appendChild(globalSlider);
            globalContainer.querySelector('.inline-radio').style.display = 'none';
            globalContainer.appendChild(globalToggleLabel);

            globalToggle.addEventListener('change', () => {
                if (globalToggle.checked) {
                    globalYesRadio.checked = true;
                } else {
                    globalNoRadio.checked = true;
                }
                updateUI();
            });

            ['call','text','email'].forEach(channel => {
                const yesRadio = form.querySelector(`input[name="${channel}Consent"][value="yes"]`);
                const noRadio = form.querySelector(`input[name="${channel}Consent"][value="no"]`);
                const row = yesRadio.closest('.channel-row');
                const toggleLabel = document.createElement('label');
                toggleLabel.className = 'switch';
                const toggle = document.createElement('input');
                toggle.type = 'checkbox';
                toggle.id = `${channel}Consent`;
                toggle.name = `${channel}ConsentToggle`;
                toggle.checked = yesRadio.checked;
                const slider = document.createElement('span');
                slider.className = 'slider';
                toggleLabel.appendChild(toggle);
                toggleLabel.appendChild(slider);
                row.querySelector('.inline-radio').style.display = 'none';
                row.appendChild(toggleLabel);

                toggle.addEventListener('change', () => {
                    if (toggle.checked) {
                        yesRadio.checked = true;
                    } else {
                        noRadio.checked = true;
                    }
                    updateUI();
                });
            });
        })();

        // Pre-populate consent toggles if contact has existing consent
        if (contactInfo) {
            // callConsent provided by backend; assume false if undefined
            if (typeof contactInfo.callConsent === 'undefined') {
                contactInfo.callConsent = false;
            }
        }

        // Pre-populate consent toggles if contact has existing consent
        if (contactInfo && contactInfo.hasConsent) {
            // Set global consent based on existing data
            const hasAllConsents = contactInfo.emailConsent && contactInfo.textConsent && contactInfo.callConsent;
            
            if (hasAllConsents) {
                // Set global consent to "yes"
                form.querySelector('input[name="globalConsent"][value="yes"]').checked = true;
                document.getElementById('globalConsentToggle').checked = true;
            } else {
                // Set global consent to "no" and individual consents
                form.querySelector('input[name="globalConsent"][value="no"]').checked = true;
                document.getElementById('globalConsentToggle').checked = false;
                
                // Set individual consent toggles
                if (contactInfo.callConsent !== undefined) {
                    form.querySelector(`input[name="callConsent"][value="${contactInfo.callConsent ? 'yes' : 'no'}"]`).checked = true;
                    document.getElementById('callConsent').checked = contactInfo.callConsent;
                }
                if (contactInfo.textConsent !== undefined) {
                    form.querySelector(`input[name="textConsent"][value="${contactInfo.textConsent ? 'yes' : 'no'}"]`).checked = true;
                    document.getElementById('textConsent').checked = contactInfo.textConsent;
                }
                if (contactInfo.emailConsent !== undefined) {
                    form.querySelector(`input[name="emailConsent"][value="${contactInfo.emailConsent ? 'yes' : 'no'}"]`).checked = true;
                    document.getElementById('emailConsent').checked = contactInfo.emailConsent;
                }
            }
            
            // Set preferred method if available
            if (contactInfo.preferredMethod) {
                document.getElementById('preferredContact').value = contactInfo.preferredMethod;
            }
            
            // Update UI to reflect pre-populated state
            updateUI();
        }

        function populatePreferred(options) {
            preferredSelect.innerHTML = '<option value="" disabled selected>Select...</option>';
            options.forEach(opt => {
                const optionEl = document.createElement('option');
                optionEl.value = opt;
                optionEl.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
                preferredSelect.appendChild(optionEl);
            });
        }

        function updateUI() {
            const globalYes = form.querySelector('input[name="globalConsent"]:checked').value === 'yes';
            if (globalYes) {
                individualConsentSection.style.display = 'none';
                preferredGroup.style.display = 'block';
                populatePreferred(['call', 'text', 'email']);
            } else {
                individualConsentSection.style.display = 'block';
                const selected = [];
                if (form.querySelector('input[name="callConsent"][value="yes"]').checked) selected.push('call');
                if (form.querySelector('input[name="textConsent"][value="yes"]').checked) selected.push('text');
                if (form.querySelector('input[name="emailConsent"][value="yes"]').checked) selected.push('email');

                if (selected.length === 0) {
                    preferredGroup.style.display = 'none';
                    preferredSelect.value = '';
                } else {
                    preferredGroup.style.display = 'block';
                    populatePreferred(selected);
                    if (selected.length === 1) preferredSelect.value = selected[0];
                }
            }
        }

        // Initialize UI and listeners (call updateUI after pre-population)
        updateUI();
        globalConsentRadios.forEach(radio => radio.addEventListener('change', updateUI));
        individualConsentRadios.forEach(radio => radio.addEventListener('change', updateUI));

        // Real-time validation

        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearError(this);
            });
        });

        checkbox.addEventListener('change', function() {
            clearError(this);
        });

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitForm();
            }
        });

        function validateField(field) {
            const value = field.value.trim();
            
            if (!validateRequired(value)) {
                showError(field, 'This field is required');
                return false;
            }
            
            if (field.type === 'email' && !validateEmail(value)) {
                showError(field, 'Please enter a valid email address');
                return false;
            }
            
            if (field.type === 'tel' && !validatePhone(value)) {
                showError(field, 'Please enter a valid phone number');
                return false;
            }
            
            clearError(field);
            return true;
        }

        function validateForm() {
            let isValid = true;

            // Validate all text inputs (except lastName which is optional)
            inputs.forEach(input => {
                if (input.id === 'lastName') {
                    // Skip validation for lastName as it's optional
                    return;
                }
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            // Validate acknowledgment checkbox
            if (!checkbox.checked) {
                showError(checkbox, 'You must agree to the terms and conditions');
                isValid = false;
            } else {
                clearError(checkbox);
            }

            // Consent logic
            const globalYes = form.querySelector('input[name="globalConsent"]:checked').value === 'yes';

            if (globalYes) {
                if (!preferredSelect.value) {
                    showError(preferredSelect, 'Please select a preferred contact method');
                    isValid = false;
                } else {
                    clearError(preferredSelect);
                }
            } else {
                const anyIndividualYes = ['callConsent','textConsent','emailConsent']
                    .some(name => form.querySelector(`input[name="${name}"][value="yes"]`).checked);
                if (!anyIndividualYes) {
                    showError(individualConsentSection, 'Please consent to at least one contact method');
                    isValid = false;
                }
                if (!preferredSelect.value) {
                    showError(preferredSelect, 'Please select a preferred contact method');
                    isValid = false;
                }
            }

            return isValid;
        }

        function submitForm() {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            const globalYes = form.querySelector('input[name="globalConsent"]:checked').value === 'yes';
            
            // Collect form data - Updated to match backend expectations
            const formData = {
                contactId: contactId,            // From URL
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                consent: checkbox.checked,
                globalConsent: globalYes,
                callConsent: globalYes ? true : form.querySelector('input[name="callConsent"][value="yes"]').checked,
                textConsent: globalYes ? true : form.querySelector('input[name="textConsent"][value="yes"]').checked,
                emailConsent: globalYes ? true : form.querySelector('input[name="emailConsent"][value="yes"]').checked,
                preferredContact: document.getElementById('preferredContact').value
            };
            
            // Make API call to the specified endpoint
            fetch('https://us-central1-addy-ai-dev.cloudfunctions.net/api/user/consent-form', {
            // fetch('http://localhost:8080/api/user/consent-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Show success page with redirect option
                const successContainer = document.createElement('div');
                successContainer.className = 'success-container';
                successContainer.innerHTML = `
                    <div class="success-card">
                        <div class="success-icon">✓</div>
                        <h3 class="success-title">Consent Submitted Successfully!</h3>
                        <p class="success-message">Thank you ${formData.firstName}! Your consent preferences have been recorded.</p>
                        <div class="success-details">
                            <div class="detail-row">
                                <span class="detail-label">Name:</span>
                                <span class="detail-value">${formData.firstName} ${formData.lastName || ''}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Email:</span>
                                <span class="detail-value">${formData.email}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Phone:</span>
                                <span class="detail-value">${formData.phone}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Preferred Contact:</span>
                                <span class="detail-value">${formData.preferredContact.charAt(0).toUpperCase() + formData.preferredContact.slice(1)}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Consented Methods:</span>
                                <span class="detail-value">${[
                                    formData.callConsent ? 'Call' : null,
                                    formData.textConsent ? 'Text' : null,
                                    formData.emailConsent ? 'Email' : null
                                ].filter(Boolean).join(', ')}</span>
                            </div>
                        </div>

                    </div>
                `;

                // Add success styles if not already present
                if (!document.querySelector('#success-styles')) {
                    const successStyle = document.createElement('style');
                    successStyle.id = 'success-styles';
                    successStyle.textContent = `
                        .success-container {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0,0,0,0.5);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 1000;
                        }
                        .success-card {
                            background: #fff;
                            padding: 30px;
                            border-radius: 15px;
                            max-width: 450px;
                            width: 90%;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                            text-align: center;
                            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        }
                        .success-icon {
                            width: 60px;
                            height: 60px;
                            background: #27ae60;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 20px;
                            color: white;
                            font-size: 30px;
                            font-weight: bold;
                        }
                        .success-title {
                            color: #333;
                            margin-bottom: 10px;
                            font-size: 22px;
                            font-weight: 600;
                        }
                        .success-message {
                            color: #666;
                            margin-bottom: 25px;
                            font-size: 16px;
                            line-height: 1.5;
                        }
                        .success-details {
                            background: #EEF1F5;
                            border-radius: 15px;
                            padding: 20px;
                            margin-bottom: 25px;
                            text-align: left;
                        }
                        .detail-row {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 10px;
                            padding: 5px 0;
                        }
                        .detail-row:last-child {
                            margin-bottom: 0;
                        }
                        .detail-label {
                            font-weight: 500;
                            color: #4B5563;
                        }
                        .detail-value {
                            color: #333;
                            font-weight: 400;
                        }
                        .success-actions {
                            display: flex;
                            flex-direction: column;
                            gap: 15px;
                        }
                        .return-app-btn {
                            background: #745dde;
                            color: white;
                            text-decoration: none;
                            padding: 12px 30px;
                            border-radius: 15px;
                            font-size: 16px;
                            font-weight: 500;
                            cursor: pointer;
                            transition: background-color 0.3s ease;
                            display: inline-block;
                            text-align: center;
                        }
                        .return-app-btn:hover {
                            background: #5a47b8;
                            text-decoration: none;
                        }
                        .success-close-btn {
                            background: #745dde;
                            color: white;
                            border: none;
                            padding: 12px 30px;
                            border-radius: 15px;
                            font-size: 16px;
                            font-weight: 500;
                            cursor: pointer;
                            transition: background-color 0.3s ease;
                        }
                        .success-close-btn:hover {
                            background: #5a47b8;
                        }
                    `;
                    document.head.appendChild(successStyle);
                }

                // Show the success overlay
                document.body.appendChild(successContainer);
                
                // Reset form
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
                
                console.log('API response:', data);
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.style.marginTop = '15px';
                errorMessage.style.textAlign = 'center';
                errorMessage.textContent = 'Sorry, there was an error submitting your information. Please try again.';
                form.appendChild(errorMessage);
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
                
                // Remove error message after 5 seconds
                setTimeout(() => {
                    errorMessage.remove();
                }, 5000);
            });
        }
    }

    // Initialize form when window is loaded
    window.addEventListener('load', function() {
        // console.log('Window loaded, checking for consent-form div...');
        
        const formContainer = document.getElementById('consent-form');
        if (formContainer) {
            // console.log('✅ Consent form container found:', formContainer);
            createConsentForm();
        } else {
            // console.log('❌ Consent form container NOT found');
            // console.log('Available elements with IDs:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
        }
    });
})();