const app = require('./src/app');

const APP_PORT = 5050;

app.listen(APP_PORT, () => {
    console.log(`-- 3380 API is listening at http://localhost:${APP_PORT}`);
});
