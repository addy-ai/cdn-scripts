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
    function createConsentForm() {
        const formContainer = document.getElementById('consent-form');
        if (!formContainer) {
            console.error('Consent form container not found');
            return;
        }

        const formHTML = `
            <div class="consent-form-wrapper">
                <form id="addy-consent-form" class="consent-form">
                    <h2 class="form-title">Addy Consent Form</h2>
                    <div class="form-group">
                        <label for="firstName">First Name *</label>
                        <input type="text" id="firstName" name="firstName" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="lastName">Last Name *</label>
                        <input type="text" id="lastName" name="lastName" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Phone Number *</label>
                        <input type="tel" id="phone" name="phone" required>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="consent" name="consent" required>
                            <span class="checkmark"></span>
                            <span class="consent-text">
                                I agree to receive loan status updates from Addy at the phone number or email I provided. 
                                Data rates may apply, and I can reply STOP to opt out.
                                <a href="/privacy-policy" target="_blank">Privacy Policy</a> and 
                                <a href="/terms-of-service" target="_blank">Terms of Service</a>.
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
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                
                .form-title {
                    text-align: center;
                    color: #333;
                    margin-bottom: 25px;
                    font-size: 24px;
                    font-weight: 600;
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
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 16px;
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
                    border-radius: 4px;
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
            
            // Validate all text inputs
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            // Validate checkbox
            if (!checkbox.checked) {
                showError(checkbox, 'You must agree to the terms and conditions');
                isValid = false;
            } else {
                clearError(checkbox);
            }
            
            return isValid;
        }

        function submitForm() {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            // Collect form data
            const formData = {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                consent: checkbox.checked
            };
            
            // Make API call to the specified endpoint
            fetch('https://us-central1-addy-ai-dev.cloudfunctions.net/api/user/consent-form', {
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
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you! Your information has been submitted successfully.';
                form.appendChild(successMessage);
                
                // Reset form
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
                
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

    // Initialize form when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createConsentForm);
    } else {
        createConsentForm();
    }
})();