/* eslint-disable */

dispatcher.dispatch('Mail.send', {
  to: 'zamfir.victor@gmail.com',
  template: 'hello',
  context: {
    name: 'Victor',
  },
}).then((response) => {
  console.log(response);
}, (sendErr) => {
  console.log(sendErr);
});
