export const imgPath = "/assets/images";
export const vidPath = "/assets/videos";
export const host = process.env.HOST;
export const url = `/api/`;

// Database
export const DB_URI = `mongodb+srv://flexscaleapp:8zVzAThqbpEQYLiA@flexcluster.ccdqq9w.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

// Stripe
export const Stripe_Publish_Key = process.env.STRIPE_PK_KEY;
export const Stripe_SecretT_Key = process.env.STRIPE_SK_KEY;
export const Stripe_Endpoint_Secret = process.env.STRIPE_WH;

// Plaid
export const Client_Secret_Id = process.env.PLAID_CK;
export const Plaid_Secret_Key = process.env.PLAID_SK;
export const Sandbox_Key = process.env.PLAID_SANDBOX

// s3
export const AWS_S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
export const AWS_S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;

// sendgrid
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
// Nodemailer
export const SMTPSettings = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
}

export const CLIENT_SUPER_ADMIN = { label: 'Client Super Admin', level: 1 };
export const CLIENT_BILLING_ADMIN = { label: 'Client Billing Admin', level: 2 };
export const CLIENT_USER = { label: 'Client User', level: 3 };
export const INTERNAL_ADMIN = { label: 'Internal Admin', level: 4 };
export const INTERNAL_MANAGER = { label: 'Internal Manager', level: 5 };
export const INTERNAL_USER = { label: 'Internal User', level: 6 };

export const accessLevel = [CLIENT_SUPER_ADMIN, CLIENT_BILLING_ADMIN, CLIENT_USER, INTERNAL_ADMIN, INTERNAL_MANAGER, INTERNAL_USER];
export const accessLevelInternalManager = [CLIENT_SUPER_ADMIN, CLIENT_BILLING_ADMIN, CLIENT_USER, INTERNAL_MANAGER, INTERNAL_USER];
export const accessLevelClientSuperAdmin = [CLIENT_SUPER_ADMIN, CLIENT_BILLING_ADMIN, CLIENT_USER];
export const accessLevelClientBillingAdmin = [CLIENT_BILLING_ADMIN, CLIENT_USER];
export const accessLevelClientUser = [CLIENT_USER];
export const candidateStatus = ['New', 'Interviewing', 'Hired', 'Rejected'];
export const typeOfEmployment = ['Full-Time', 'Part-Time', 'Contract', 'None'];
export const contractStatus = ["Onboarding", "Active", "On Leave", "Inactive", "Ended"];
export const invoiceTypes = ["Onboarding", "Hourly", "Custom"];
export const invoiceStatus = ['Open', 'Paid', 'Void', 'Past Due'];



