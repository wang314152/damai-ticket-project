const axios = require('axios');

async function test() {
    try {
        const res = await axios.post('http://localhost:8081/api/auth/login', {
            username: 'admin',
            password: 'admin123'
        });
        console.log('Login OK:', JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.log('Login FAIL:', e.message);
    }
}

test();
