// DOM Elements
const passwordInput = document.getElementById('password');
const generateBtn = document.getElementById('generate');
const copyBtn = document.getElementById('copy');
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
const strengthFill = document.getElementById('strength-fill');
const strengthText = document.getElementById('strength-text');

// Character sets
const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Update length display
lengthSlider.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value;
    updatePasswordStrength();
});

// Generate password function
const generatePassword = () => {
    const length = parseInt(lengthSlider.value);
    let charset = '';

    // Build charset based on selected options
    if (document.getElementById('uppercase').checked) charset += charSets.uppercase;
    if (document.getElementById('lowercase').checked) charset += charSets.lowercase;
    if (document.getElementById('numbers').checked) charset += charSets.numbers;
    if (document.getElementById('symbols').checked) charset += charSets.symbols;

    // Ensure at least one character type is selected
    if (charset === '') {
        alert('Please select at least one character type!');
        return;
    }

    let password = '';

    // Generate password
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    passwordInput.value = password;
    updatePasswordStrength();
};

// Calculate password strength
const updatePasswordStrength = () => {
    const password = passwordInput.value;
    if (!password) return;

    let score = 0;
    const length = password.length;

    // Length scoring
    if (length >= 12) score += 2;
    else if (length >= 8) score += 1;

    // Character variety scoring
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Update UI based on score
    let strength, color, percentage;
    if (score <= 2) {
        strength = 'Weak';
        color = '#ef4444';
        percentage = 25;
    } else if (score <= 4) {
        strength = 'Fair';
        color = '#f59e0b';
        percentage = 50;
    } else if (score <= 5) {
        strength = 'Good';
        color = '#3b82f6';
        percentage = 75;
    } else {
        strength = 'Strong';
        color = '#10b981';
        percentage = 100;
    }

    strengthFill.style.width = `${percentage}%`;
    strengthFill.style.background = color;
    strengthText.textContent = `Password Strength: ${strength}`;
    strengthText.style.color = color;
};

// Copy password to clipboard
const copyPassword = async () => {
    if (!passwordInput.value) {
        alert('Generate a password first!');
        return;
    }

    try {
        await navigator.clipboard.writeText(passwordInput.value);
        // Visual feedback
        const originalIcon = copyBtn.textContent;
        copyBtn.textContent = '✅';
        copyBtn.style.color = '#10b981';
        setTimeout(() => {
            copyBtn.textContent = originalIcon;
            copyBtn.style.color = '';
        }, 1000);
    } catch (err) {
        // Fallback for older browsers
        passwordInput.select();
        document.execCommand('copy');
        alert('Password copied to clipboard!');
    }
};

// Add event listeners
generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyPassword);

// Add listeners to checkboxes for real-time strength updates
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', updatePasswordStrength);
});

// Generate initial password on load
document.addEventListener('DOMContentLoaded', () => {
    generatePassword();
});