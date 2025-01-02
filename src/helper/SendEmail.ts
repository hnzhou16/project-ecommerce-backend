const nodemailer = require('nodemailer');

export const sendEmail = async ({ to, subject, text }) => {
    try {
        // Configure the transporter with email service details
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // Or use SMTP or other supported services
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender's email
            to,                           // Recipient's email
            subject,                      // Email subject
            text,                         // Email text content
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error('Email could not be sent');
    }
};
