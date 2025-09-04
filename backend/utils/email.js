const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host : process.env.SMTP_HOST,
    port : process.env.SMTP_PORT,
    secure : false,
    auth : {
        user : process.env.SMTP_USER,
        pass : process.env.SMTP_PASS,
    },
});

const sendEmail = async ({to, subject, text, html}) => {
    try{
        await transporter.sendMail({
            from : ` "Vespera" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log(`Email sent to ${to}`);

    }catch(err){
        console.error("Failed to send email: ", err);
        throw new Error("Email not sent");
    }
};

module.exports = sendEmail;
