import nodemailer from 'nodemailer'

export const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            }
        });

        const info = await transporter.sendMail({
            from: `"Chat-Support"<${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
        });
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Email sending error:", error);
        throw error;
    }
}


// export const mailToforgetPassword =async (options)=>{
    
//     const transporter = nodemailer.createTransport({
//         service:"gmail",
//         auth: {
//           // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//           user: "nancyelsayed0648@gmail.com",
//             pass: "jtxy fxlr mgsx nwoq",
//         }
//       });
    
    
    
    
    
    
   
    
//     const info = await transporter.sendMail({
        
//         from: '"E-Commerce"<nancyelsayed0648@gmail.com>', // sender address
//         to: options.email, // list of receivers
//         subject: "Reset Password", // Subject line
        
//         html:forgetPassHtmlCode(options.newPassword), // html body
//       });
//       console.log("Message sent fp: %s", info.messageId);
//     }



    
 
    
//    export const sendReminderEmail = async (userEmail) => {
      

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'nancynancy0648@gmail.com',
//           pass: 'jybgmjwahkdrhgpm'
//       },
//     });

//     const info = await transporter.sendMail( {
//         from: 'oute"<nancynancy0648@gmail.com>',
//         to: userEmail,
//         subject: 'Reminder: Confirm Your Email',
//         text: 'Please confirm your email to prevent deletion of your account.',
//       });
//       console.log("Message sent fp: %s", info.messageId);
      
//     };