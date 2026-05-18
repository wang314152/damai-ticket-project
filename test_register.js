const axios = require('axios');

async function test() {
    // 测试注册
    console.log('=== 测试注册 ===');
    try {
        const res = await axios.post('http://localhost:8081/api/auth/register', {
            username: 'testuser',
            password: '123456',
            phone: '13900000000'
        });
        console.log('注册结果:', JSON.stringify(res.data));
    } catch (e) {
        console.log('注册失败:', e.response?.data || e.message);
    }

    // 测试登录
    console.log('\n=== 测试登录 ===');
    try {
        const res = await axios.post('http://localhost:8081/api/auth/login', {
            username: 'admin',
            password: 'admin123'
        });
        console.log('登录结果:', JSON.stringify(res.data));
    } catch (e) {
        console.log('登录失败:', e.response?.data || e.message);
    }
}

test();
