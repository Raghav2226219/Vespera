const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS,
    },
});

const sendEmail = async ({to, subject, text, html}) => {
    try{
        await transporter.sendMail({
            from : ` "Vespera" <${process.env.EMAIL_USER}>`,
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
