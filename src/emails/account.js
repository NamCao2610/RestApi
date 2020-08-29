const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'namdepzai2610@gmail.com',
        subject: 'Thanks for jonning in!',
        text: `Hello ${name}. Let me know you get along with the app. `
    })
}

const sendCancelationMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'namdepzai2610@gmail.com',
        subject: 'Sorry to see you go',
        text: `Goobye ${name}. I hope to see you back sometime soon. `
    })
}

module.exports = {
    sendWelcomeMail,
    sendCancelationMail
}