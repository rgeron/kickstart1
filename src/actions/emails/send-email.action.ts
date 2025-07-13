"use server";

import { resendMailAdapter } from "@/lib/emails/resend";

const styles = {
  container:
    "max-width:500px;margin:20px auto;padding:20px;border:1px solid #ddd;border-radius:6px;",
  heading: "font-size:20px;color:#333;",
  paragraph: "font-size:16px;",
  link: "display:inline-block;margin-top:15px;padding:10px 15px;background:#007bff;color:#fff;text-decoration:none;border-radius:4px;",
};

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
  const emailParams = {
    from: process.env.RESEND_EMAIL_FROM || "noreply@example.com",
    to,
    subject: `BetterAuthy - ${subject}`,
    html: `
    <div style="${styles.container}">
      <h1 style="${styles.heading}">${subject}</h1>
      <p style="${styles.paragraph}">${meta.description}</p>
      <a href="${meta.link}" style="${styles.link}">Click Here</a>
    </div>
    `,
  };

  try {
    const result = await resendMailAdapter.send(emailParams);

    if (result.error) {
      console.error("[SendEmail]:", result.error);
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error("[SendEmail]:", err);
    return { success: false };
  }
}
