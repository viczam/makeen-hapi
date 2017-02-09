const handler = ({ transporter, renderTemplate, app, emailsDir }) =>
  async ({ params }) => {
    const { template, context, ...restParams } = params;

    const html = await renderTemplate(template, {
      ...context,
      transportConfig: restParams,
      app,
    });

    return new Promise((resolve, reject) => {
      transporter.sendMail({
        ...restParams,
        html,
        emailsDir,
      }, (err, info) => {
        if (err) {
          return reject(err);
        }

        return resolve(info);
      });
    });
  };

export default handler;
