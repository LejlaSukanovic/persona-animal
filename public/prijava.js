document.addEventListener("DOMContentLoaded", function () {
    var animationContainer = document.getElementById('animation_container');
    var loadingContainer = document.getElementById('loading_container');
    var loadingAnimationContainer = document.getElementById('loading_animation_container');
    var successPopup = document.getElementById('success_popup');
    var successAnimationContainer = document.getElementById('success_animation_container');
    var successMessage = document.getElementById('success_message');
    var errorPopup = document.getElementById('error_popup');
    var errorAnimationContainer = document.getElementById('error_animation_container');
    var errorMessage = document.getElementById('error_message');

    var loginForm = document.getElementById('form-content-prijava');
    var registerForm = document.getElementById('form-content-registracija');
    var showRegisterLink = document.getElementById('show_register');
    var showLoginLink = document.getElementById('show_login');

    var animation = lottie.loadAnimation({
        container: animationContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/Animation/Doggo.json'
    });

    var loadingAnimation = lottie.loadAnimation({
        container: loadingAnimationContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/Animation/LoadingAnimation.json'
    });

    var successAnimation = lottie.loadAnimation({
        container: successAnimationContainer,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: '/Animation/UspjesnoCheck.json'
    });

    var errorAnimation = lottie.loadAnimation({
        container: errorAnimationContainer,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: '/Animation/No.json'
    });

    function showLoading() {
        loadingContainer.style.display = 'flex';
    }

    function hideLoading() {
        loadingContainer.style.display = 'none';
    }

    function showSuccessPopup(message) {
        successMessage.innerText = message;
        successPopup.style.display = 'flex';
        successAnimation.goToAndPlay(0, true);
    }

    function hideSuccessPopup() {
        successPopup.style.display = 'none';
    }

    function showErrorPopup(message) {
        errorMessage.innerText = message;
        errorPopup.style.display = 'flex';
        errorAnimation.goToAndPlay(0, true);
    }

    function hideErrorPopup() {
        errorPopup.style.display = 'none';
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function validateFields(fields, type) {
        let isValid = true;
        fields.forEach(field => {
            const input = document.getElementById(`${type}-${field.id}`);
            const validationMessage = document.getElementById(`${field.id}-validation`);
            if (input.value.trim() === '') {
                validationMessage.innerText = 'Prosimo vnesite vaše podatke!';
                validationMessage.style.display = 'block';
                isValid = false;
            } else {
                validationMessage.style.display = 'none';
            }
        });
        return isValid;
    }

    // Register function
// Updated register function
window.register = async function () {
    const fields = [
        { id: 'email' },
        { id: 'password' },
        { id: 'username' }
    ];

    if (!validateFields(fields, 'register')) {
        return;
    }

    showLoading();
    try {
        const response = await Promise.all([
            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: document.getElementById('register-email').value,
                    password: document.getElementById('register-password').value,
                    username: document.getElementById('register-username').value
                })
            }),
            delay(2000)
        ]);

        const data = await response[0].json();
        if (response[0].ok) {
            showSuccessPopup('Uspešno ste se registrirali!');
            await delay(2000);
            hideSuccessPopup();

            // Switch to login form
            showLoginLink.click();
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        if (error.message.includes('Email is already in use in the database')) {
            showErrorPopup('Email je že v uporabi. Prosimo, poskusite z drugim emailom!');
            await delay(2000);
            hideErrorPopup();
        } else {
            console.error('Error registering user:', error);
            alert(error.message);
        }
    } finally {
        hideLoading();
    }
}

// The rest of the script remains unchanged


    // Login function
    window.login = async function () {
        const fields = [
            { id: 'email' },
            { id: 'password' }
        ];

        if (!validateFields(fields, 'login')) {
            return;
        }

        showLoading();
        try {
            const response = await Promise.all([
                fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: document.getElementById('login-email').value,
                        password: document.getElementById('login-password').value
                    })
                }),
                delay(2000)
            ]);

            const data = await response[0].json();
            if (response[0].ok) {
                sessionStorage.setItem('idUporabnik', data.idUporabnik);
                showSuccessPopup('Uspešno ste se prijavili!');
                await delay(2000);
                window.location.href = '/samoocenitev';
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            if (error.message.includes('auth/invalid-credential')) {
                showErrorPopup('Napačen email ali geslo. Prosimo, poskusite znova!');
                await delay(2000);
                hideErrorPopup();
            } else if (error.message.includes('auth/invalid-email')){
                showErrorPopup('Napačen email ali geslo. Prosimo, poskusite znova!');
                await delay(2000);
                hideErrorPopup();
            }
        } finally {
            hideLoading();
            hideSuccessPopup();
        }
    }
    
    showRegisterLink.addEventListener('click', function(event) {
    event.preventDefault();
    // Slide out the login form and slide in the registration form
    loginForm.classList.add('form-slide-out');
    setTimeout(() => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        registerForm.classList.remove('form-slide-out');
        registerForm.classList.add('form-slide-in');
    }, 500); // Match the duration of the slide-out animation
    showLoginLink.style.display = 'inline';
    showRegisterLink.style.display = 'none';
});

showLoginLink.addEventListener('click', function(event) {
    event.preventDefault();
    // Slide out the registration form and slide in the login form
    registerForm.classList.add('form-slide-out');
    setTimeout(() => {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        loginForm.classList.remove('form-slide-out');
        loginForm.classList.add('form-slide-in');
    }, 500); // Match the duration of the slide-out animation
    showLoginLink.style.display = 'none';
    showRegisterLink.style.display = 'inline';
});

});
