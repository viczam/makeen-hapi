import * as handlers from './handlers';

export default ({
  dispatcher, renderTemplate, transporter, app, emailsDir,
}) => {
  const { subscribe, onAfter } = dispatcher;

  onAfter('User.register', handlers.onAfterRegistration);

  subscribe('Mail.sendActivationEmail', handlers.sendActivationEmail);

  onAfter('User.resetPassword', handlers.onAfterPasswordReset);
};
