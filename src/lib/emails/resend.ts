import { Resend } from "resend";
import type { MailAdapter } from "./send-email";

export const resend = new Resend(process.env.RESEND_API_KEY!);

export const resendMailAdapter: MailAdapter = {
  send: async (params) => {
    const result = await resend.emails.send(params);

    if (result.error) {
      return { error: new Error(result.error.message), data: null };
    }

    if (!result.data) {
      return { error: new Error("No data returned from Resend"), data: null };
    }

    return { error: null, data: { id: result.data.id } };
  },
};
