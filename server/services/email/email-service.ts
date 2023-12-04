import ejs from "ejs";
import dotenv from "dotenv";

import { SentMessageInfo, createTransport, SendMailOptions } from "nodemailer";
import { Attachment } from "nodemailer/lib/mailer";
import { WebFlatItem } from "../web-scraping/flat-web-scraping/WebFlatTypes";

type EmailSendObject = {
  receiver: string;
  htmlContent?: any;
  content?: string;
  subject: string;
  attachments?: Attachment[];
};

const BASE_ATTACHMENTS = [
  {
    filename: "image-1.png",
    path: __dirname + "/templates/images/image-1.png",
    cid: "image1", //same cid value as in the html img src
  },
  {
    filename: "image-2.png",
    path: __dirname + "/templates/images/image-2.png",
    cid: "image2", //same cid value as in the html img src
  },
  {
    filename: "image-3.png",
    path: __dirname + "/templates/images/image-3.png",
    cid: "image3", //same cid value as in the html img src
  },
  {
    filename: "image-4.png",
    path: __dirname + "/templates/images/image-4.png",
    cid: "image4", //same cid value as in the html img src
  },
  {
    filename: "image-5.png",
    path: __dirname + "/templates/images/image-5.png",
    cid: "image5", //same cid value as in the html img src
  },
  {
    filename: "image-6.png",
    path: __dirname + "/templates/images/image-6.png",
    cid: "image6", //same cid value as in the html img src
  },
];

dotenv.config();

const transport = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASS,
  },
});

export class EmailService {
  sendMail({
    receiver,
    htmlContent,
    subject,
    content,
    attachments,
  }: EmailSendObject): void {
    let time = new Date().getTime();
    let mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: receiver,
      subject: subject + " - " + time,
      text: content,
      html: htmlContent,
      attachments: attachments,
    } as SendMailOptions;

    transport.sendMail(
      mailOptions,
      (error: Error | null, info: SentMessageInfo) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
      }
    );
  }
  sendVerificationMail(
    userEmail: string,
    username: string,
    id: string,
    linkToken: string
  ): void {
    ejs.renderFile(
      __dirname + "/templates/validate-account-email.ejs",
      {
        username: username,
        title: "Verifikuj svoj mejl",
        userId: id,
        linkToken,
      },
      (err: Error | null, data: any) => {
        if (err) {
          console.log(err);
          return;
        }
        this.sendMail({
          receiver: userEmail,
          htmlContent: data,
          subject: "Verification",
          attachments: BASE_ATTACHMENTS,
        });
      }
    );
  }
  sendFlatNotificationMail(userEmail: string, flats: WebFlatItem[]): void {
    ejs.renderFile(
      __dirname + "/templates/flat-notification-email.ejs",
      {
        title: "Nov stan na halo oglasima",
        flats: flats,
      },
      (err: Error | null, data: any) => {
        if (err) {
          console.log(err);
          return;
        }
        this.sendMail({
          receiver: userEmail,
          htmlContent: data,
          subject: "Flat notification",
          attachments: BASE_ATTACHMENTS,
        });
      }
    );
  }
}
