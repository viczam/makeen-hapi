export default ({ result, dispatch }) => {
  if (!result || !result.user) {
    return;
  }

  const { user } = result;

  dispatch('Mail.send', {
    to: user.email,
    subject: 'forgot password',
    template: 'ForgotPassword',
    context: {
      user,
    },
  });
};
