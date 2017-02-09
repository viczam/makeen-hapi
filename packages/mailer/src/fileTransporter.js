import fs from 'fs';

export default {
  sendMail(config, cb) {
    const { subject, html, emailsDir } = config;
    const emailPath = `${emailsDir}/${new Date().getTime()} - ${subject}.html`;
    return fs.writeFile(emailPath, html, cb);
  },
};
