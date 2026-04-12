/**
 * STRATEGYIQ LOGIN ENGINE (v18.9)
 * Authentication & Daria Reveal Trigger
 */

(function() {
    'use strict';

    // ─── CONFIGURATION ───
    const CORRECT_PASSCODE = 'NARI2024';
    const REDIRECT_DELAY = 3000;

    // ─── ELEMENTS ───
    const loginForm = document.getElementById('loginForm');
    const passcodeInput = document.getElementById('passcode');
    const submitBtn = document.getElementById('submitBtn');
    const dariaBg = document.getElementById('dariaBackground');

    // ─── VERIFICATION FLOW ───
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const enteredCode = passcodeInput.value.trim().toUpperCase();

            // 1. Initial State: Verifying...
            submitBtn.innerText = 'Verifying...';
            submitBtn.disabled = true;
            passcodeInput.disabled = true;

            setTimeout(() => {
                if (enteredCode === CORRECT_PASSCODE) {
                    handleSuccess();
                } else {
                    handleError();
                }
            }, 600);
        });
    }

    function handleSuccess() {
        // 1. Update UI to Success State
        submitBtn.innerText = 'Access granted ✓';
        submitBtn.classList.add('success');

        // 2. Trigger the Daria Reveal (Easter Egg)
        if (dariaBg) {
            dariaBg.classList.add('active');
        }

        // 3. Set Session & Redirect after the animation finishes
        localStorage.setItem('authSession', 'active');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, REDIRECT_DELAY);
    }

    function handleError() {
        // 1. Trigger Shake Animation
        passcodeInput.classList.add('shake');
        
        // 2. Update Button to Error State
        submitBtn.innerText = 'Invalid code';
        submitBtn.style.background = '#F96F6E'; // Temporary coral color for error
        submitBtn.style.color = '#FFFFFF';

        // 3. Reset after 2s
        setTimeout(() => {
            passcodeInput.classList.remove('shake');
            passcodeInput.disabled = false;
            passcodeInput.value = '';
            passcodeInput.focus();
            
            submitBtn.innerText = 'Continue';
            submitBtn.disabled = false;
            submitBtn.style.background = ''; // Reverts to CSS default (white)
            submitBtn.style.color = '';
        }, 2000);
    }

})();
