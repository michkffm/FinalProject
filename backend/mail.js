import { Resend } from 'resend';

// Keep the transport replaceable for tests without sending real messages.
export const mail = {
  async send(message) {
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_EMAIL) {
      throw new Error('Mailversand ist nicht konfiguriert.');
    }
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      ...message,
      from: process.env.RESEND_EMAIL,
    });
    if (error) throw new Error('Mailversand fehlgeschlagen.');
  },
};
