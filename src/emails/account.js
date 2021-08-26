const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: process.env.EMAIL,
        subject: 'Thanks for joining in!',
        text: `welcome to the app, ${name}. Let me know how you get along with app.`
    })
}

const sendAcountDeleteEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: process.env.EMAIL,
        subject: 'Sorry to see you leaving !',
        text: `Dear ${name}. We are sorry to see you leaving our familly is there anything we can do in the future to win you back?`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendAcountDeleteEmail
}
