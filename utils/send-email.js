import dayjs from "dayjs";
import { emailTemplates } from "./email-template.js";
import { accountEmail, transporter } from "../config/nodemailer.js";

export const sendReminderEmail = async ({ to, type, subscription }) => {
    if (!to || !type) throw new Error('Missing required parameters');

    const template = emailTemplates.find((t) => t.label === type);
    if (!template) throw new Error('Invalid email type');

    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('DD MMM, YYYY'),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod,
        // Add these to avoid 'undefined' in your HTML template
        accountSettingsLink: 'http://localhost:5173/account', 
        supportLink: 'mailto:support@subdub.com'
    };

    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo); // Fixed: was generateBody

    const mailOptions = {
        from: accountEmail,
        to: to,
        subject: subject,
        html: message
    };

    // Use try/catch with the Promise version of sendMail
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
        console.error('Error sending mail:', error);
        throw error; 
    }
}