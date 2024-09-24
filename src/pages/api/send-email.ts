import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import {config} from 'dotenv' 
config()
interface FormData {
  user_name: string;
  user_email: string;
  message: string;
}
const mailOptionsMessage = ({user_email,user_name,message}:FormData) =>{
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nuevo Mensaje de Contacto</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                background-color: #ffffff;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 20px;
            }
            h1 {
                color: #333;
            }
            p {
                line-height: 1.6;
                color: #555;
            }
            .footer {
                margin-top: 20px;
                font-size: 0.8em;
                color: #888;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Nuevo Mensaje de Contacto</h1>
            <p><strong>Nombre:</strong> ${user_name}</p>
            <p><strong>Email:</strong> ${user_email}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message}</p>
        </div>
        <div class="footer">
            <p>Este mensaje fue enviado desde el formulario de contacto de tu sitio web.</p>
        </div>
    </body>
    </html>
  `
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
  },
});



export const POST: APIRoute = async ({ request }) => {
  try {
    
    const formData: FormData = await request.json();

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.USER_REQ, 
      subject: `New message from ${formData.user_name}`,
      headers: {
    'X-Labels': '#consulta, #servicios, #interesado', 
  },
      html: mailOptionsMessage(formData) ,
    };

   
    await transporter.sendMail(mailOptions);

  
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error:unknown) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ success: false, error: error }), { status: 500 });
  }
};
