document.addEventListener("DOMContentLoaded", function () {
    console.log('aaaa');
    var animationContainer = document.getElementById('animation_container');
    var animation = lottie.loadAnimation({
        container: animationContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/Animation/Doggo.json'
    });

    // Register function
    window.register = async function () {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const username = document.getElementById('username').value;

        try {
            console.log('Sending registration request:', { email, password, username });
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, username })
            });
            const data = await response.json();
            console.log('Received response:', data);
            if (response.ok) {
                alert('User registered successfully!');
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error registering user:', error);
            alert(error.message);
        }
    }

    // Login function
    window.login = async function () {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            console.log('Sending login request:', { email, password });
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            console.log('Received response:', data);
            if (response.ok) {
                // Save idUporabnik to session storage
                console.log('Saving idUporabnik to session storage:', data.idUporabnik);
                sessionStorage.setItem('idUporabnik', data.idUporabnik);
                alert('User logged in successfully!');
                window.location.href = '/samoocenitev';
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error logging in user:', error);
            alert(error.message);
        }
    }
});
