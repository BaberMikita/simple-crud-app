async function testAuth() {
    console.log("=== ТЕСТИРОВАНИЕ АВТОРИЗАЦИИ ===\n");

    // Генерируем случайный email, чтобы не было ошибки "Пользователь уже существует"
    const randomEmail = 'test' + Math.floor(Math.random() * 10000) + '@mail.com';
    const testPassword = 'super_password_123';

    try {
        // --- 1. ТЕСТ РЕГИСТРАЦИИ ---
        console.log(`1. Пробуем зарегистрироваться с email: ${randomEmail}`);
        
        const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: randomEmail,
                password: testPassword
            })
        });
        
        const registerData = await registerResponse.json();
        console.log("Ответ сервера (Регистрация):");
        console.log(registerData);

        // --- 2. ТЕСТ ЛОГИНА ---
        console.log("\n2. Пробуем войти с этими же данными...");
        
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: randomEmail,
                password: testPassword
            })
        });
        
        const loginData = await loginResponse.json();
        console.log("Ответ сервера (Логин):");
        console.log(loginData);

    } catch (error) {
        console.error("Ошибка при тестировании:", error);
    }
}

testAuth();
