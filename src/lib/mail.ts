import nodemailer from "nodemailer";
import { env } from "@/env";
import hbs, {
  NodemailerExpressHandlebarsOptions,
} from "nodemailer-express-handlebars";
import path from "path";
import { create } from "express-handlebars";

const globalForNodemailer = global as unknown as {
  transporter: nodemailer.Transporter;
};

const mailClientSingleton = () => {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    auth:
      env.SMTP_USER && env.SMTP_PASSWORD
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASSWORD,
          }
        : undefined,
  });
};

export const transporter =
  globalForNodemailer.transporter ?? mailClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForNodemailer.transporter = transporter;
}

// Instantiate the view engine explicitly to prevent nodemailer-express-handlebars
// from failing on newer versions of express-handlebars
const viewEngine = create({
  extname: ".hbs",
  partialsDir: path.resolve("./src/templates"),
  layoutsDir: path.resolve("./src/templates"),
  defaultLayout: false as any,
});

// Attach Handlebars plugin
const handlebarOptions: NodemailerExpressHandlebarsOptions = {
  viewEngine: viewEngine as any,
  viewPath: path.resolve("./src/templates"),
  extName: ".hbs",
};

transporter.use("compile", hbs(handlebarOptions));

export interface SendMailOptions {
  to: string;
  subject: string;
  template: string;
  context: any;
}

export const sendTemplateMail = async (options: SendMailOptions) => {
  return transporter.sendMail({
    from: env.SMTP_FROM,
    to: options.to,
    subject: options.subject,
    template: options.template,
    context: options.context,
  } as any);
};
