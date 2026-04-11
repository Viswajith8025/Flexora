// Server/services/emailService.js
import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

/**
 * Professional HTML template for Job Provider alerts
 */
const getProviderTemplate = (providerName, seekerName, jobTitle) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; line-height: 1.6; color: #0f172a; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; }
        .logo { font-size: 24px; font-weight: 900; color: #2563eb; letter-spacing: -1px; margin-bottom: 32px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 8px; background: #eff6ff; color: #2563eb; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
        h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin: 0 0 16px; color: #0f172a; }
        p { margin: 0 0 24px; font-size: 16px; color: #475569; }
        .candidate-card { background: #f8fafc; border-radius: 16px; padding: 24px; margin: 32px 0; border: 1px solid #f1f5f9; }
        .candidate-name { font-weight: 700; color: #0f172a; display: block; margin-bottom: 4px; }
        .job-title { color: #64748b; font-size: 13px; }
        .btn { display: inline-block; background: #0f172a; color: #ffffff !important; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px; transition: all 0.2s; }
        .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">FLEXORA</div>
        <div class="badge">New Application</div>
        <h1>Candidate Pursuit</h1>
        <p>Hello ${providerName.split(' ')[0]}, a new seeker has expressed interest in your listing.</p>
        
        <div class="candidate-card">
            <span class="candidate-name">${seekerName}</span>
            <span class="job-title">Applied for: ${jobTitle}</span>
        </div>

        <p>Log in to your dashboard to review their credentials and initiate a conversation.</p>
        
        <a href="${process.env.FRONTEND_URL}/userhome" class="btn">Review Candidate</a>

        <div class="footer">
            &copy; 2026 Flexora Fintech. Industrial-grade career infrastructure.<br/>
            This is an automated notification.
        </div>
    </div>
</body>
</html>
`;

/**
 * Professional HTML template for Job Seeker status updates
 */
const getSeekerTemplate = (seekerName, jobTitle, status) => {
    const isAccepted = status === 'accepted';
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; line-height: 1.6; color: #0f172a; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; }
        .logo { font-size: 24px; font-weight: 900; color: #2563eb; letter-spacing: -1px; margin-bottom: 32px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 8px; background: ${isAccepted ? '#ecfdf5' : '#f8fafc'}; color: ${isAccepted ? '#059669' : '#64748b'}; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
        h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin: 0 0 16px; color: #0f172a; }
        p { margin: 0 0 24px; font-size: 16px; color: #475569; }
        .job-card { background: #f8fafc; border-radius: 16px; padding: 24px; margin: 32px 0; border: 1px solid #f1f5f9; }
        .job-title { font-weight: 700; color: #0f172a; display: block; margin-bottom: 4px; }
        .btn { display: inline-block; background: #0f172a; color: #ffffff !important; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px; }
        .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">FLEXORA</div>
        <div class="badge">${isAccepted ? 'Status: Accepted' : 'Status: Updated'}</div>
        <h1>Application Update</h1>
        <p>Hello ${seekerName.split(' ')[0]}, there is a professional update regarding your application.</p>
        
        <div class="job-card">
            <span class="job-title">${jobTitle}</span>
            <p style="margin: 8px 0 0; font-size: 14px; color: ${isAccepted ? '#059669' : '#475569'}; font-weight: 600;">
                Current Status: ${status.toUpperCase()}
            </p>
        </div>

        <p>${isAccepted 
            ? "Congratulations! The employer would like to move forward. Log in to initiate next steps." 
            : "The employer has updated your application status. You can review the details on your dashboard."}</p>
        
        <a href="${process.env.FRONTEND_URL}/userhome" class="btn">View Dashboard</a>

        <div class="footer">
            &copy; 2026 Flexora Fintech. Industrial-grade career infrastructure.<br/>
            This is an automated notification.
        </div>
    </div>
</body>
</html>
`};

export const sendEmailAlert = async (type, recipient, data) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.warn("⚠️ skipping email alert: RESEND_API_KEY missing.");
            return;
        }

        let subject = '';
        let html = '';

        if (type === 'application_submitted') {
            subject = `New Candidate Pursuit: ${data.jobTitle}`;
            html = getProviderTemplate(recipient.name, data.seekerName, data.jobTitle);
        } else if (type === 'status_update') {
            subject = `Flexora Status Update: ${data.jobTitle}`;
            html = getSeekerTemplate(recipient.name, data.jobTitle, data.status);
        } else {
            return; // Unsupported type
        }

        const { data: res, error } = await resend.emails.send({
            from: `Flexora <${FROM_EMAIL}>`,
            to: recipient.email,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error("🚫 Resend Error:", error);
            return { success: false, error };
        }

        console.log(`✉️ Email alert synchronization: ${type} to ${recipient.email}`);
        return { success: true, data: res };
    } catch (err) {
        console.error("💥 Email Service Exception:", err);
        return { success: false, error: err.message };
    }
};
