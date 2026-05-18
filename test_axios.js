const axios = require('axios');

async function test() {
    console.log('Testing direct connection to backend...');
    try {
        const res = await axios.post('http://localhost:8081/api/auth/login', {
            username: 'admin',
            password: 'admin123'
        });
        console.log('Backend response:', res.data);
    } catch (e) {
        console.error('Error:', e.message);
    }
    
    console.log('\nTesting via frontend proxy (5000)...');
    try {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
            username: 'admin',
            password: 'admin123'
        });
        console.log('Frontend proxy response:', res.data);
    } catch (e) {
        console.error('Proxy Error:', e.message);
    }
}

test();
