"use server";

import transporter from "@/lib/nodemailer";

export async function sendEmailAction({
  to,
  subject,
  meta,
}: {
  to: string;
  subject: string;
  meta: {
    description: string;
    link: string;
  };
}) {
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to,
    subject: `BetterAuthy - ${subject}`,
    html: `
    <html lang="en">
        <body>
            <h1>${subject}</h1>
            <p>${meta.description}</p>
            <a href="${meta.link}">CLICK HERE</a>
        </body>
    </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error("[SendEmail]:", err);
    return { success: false };
  }
}
