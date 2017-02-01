import fs from 'fs';

export default {
  sendMail(config, cb) {
    const { subject, html, app } = config;
    const emailPath = `${app.emailsDir}/${new Date().getTime()} - ${subject}.html`;
    return fs.writeFile(emailPath, html, cb);
  },
};
