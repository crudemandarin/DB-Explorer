/* Program Entrypoint */

require('dotenv').config();

const serverlessExpress = require('@vendia/serverless-express');

const APP_PORT = 5050;
const LAMBDA = !!process.env.LAMBDA_TASK_ROOT;

const app = require('./src/app');

if (LAMBDA) {
    module.exports.handler = serverlessExpress({ app });
} else {
    app.listen(APP_PORT, () => {
        console.log('\n-- API is NOT running on AWS Lambda');
        console.log(`-- 3380 API is listening at http://localhost:${APP_PORT}`);
    });
}
