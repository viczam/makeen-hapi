export default (emailsDir) => [{
  path: '/browse/{param*}',
  method: 'GET',
  handler: {
    directory: {
      path: emailsDir,
      redirectToSlash: true,
      index: true,
      listing: true,
    },
  },
  config: {
    auth: false,
    description: 'Browse the emails saved on disk',
    tags: ['api'],
  },
}];
