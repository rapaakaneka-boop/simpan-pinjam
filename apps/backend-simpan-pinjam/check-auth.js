const fetch = globalThis.fetch || require('node-fetch');

(async () => {
    try {
        const loginRes = await fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' }),
        });

        console.log('login status', loginRes.status);
        const loginBody = await loginRes.text();
        console.log('login body', loginBody);

        if (loginRes.ok) {
            const token = JSON.parse(loginBody).access_token;
            const nasabahRes = await fetch('http://localhost:8000/nasabah', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('nasabah status', nasabahRes.status);
            console.log('nasabah body', await nasabahRes.text());
        }
    } catch (err) {
        console.error('error', err);
    }
})();
