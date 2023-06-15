module.exports = {
    env: {
        HOST: process.env.HOST,
        MONGO_DB: process.env.MONGO_DB,
        STRIPE_PK_KEY: process.env.STRIPE_PK_KEY,
        STRIPE_SK_KEY: process.env.STRIPE_SK_KEY,
        STRIPE_WH: process.env.STRIPE_WH,
        PLAID_CK: process.env.PLAID_CK,
        PLAID_SK: process.env.PLAID_SK,
        PLAID_SANDBOX: process.env.PLAID_SANDBOX,
        S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
        S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASS: process.env.SMTP_PASS,
    },
  }