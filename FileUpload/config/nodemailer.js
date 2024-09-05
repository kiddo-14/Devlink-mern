import  nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: "bhojaknikhil9@gmail.com",
      pass: "anecelmttszcbxua",
    },
  });

export default transporter;  