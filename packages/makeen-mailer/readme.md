Makeen Mailer
=============

Makeen plugin that provides logic for sending HTML templated emails. Under the hood the mailer package uses
[nodemailer](https://nodemailer.com/about/) for transporting emails and [hapi-react-views](https://github.com/jedireza/hapi-react-views) for transpiling JSX templates to HTML.


#### Requirements
- Node v6 or higher

#### Installation
`npm install makeen-mailer`

#### Usage

 - Create a new hapi plugin
 - Import the makeen-mailer plugin and programatically register it by passing it the required options:

```js
import * as MakeenMailer from 'makeen-mailer';
```

```js
    const { messageBus } = server.plugins['hapi-octobus'];
    await server.register([{
      register: MakeenMailer.register,
      options: {
        transport: {
            service: 'gmail',
            auth: {
                user: 'gmail.user@gmail.com',
                pass: 'secret_password'
            }
        },
        messageBus,
        emailsDir: path.join(__dirname, '..', 'emails'),
        views: {
          relativeTo: __dirname,
        },
      },
      routes: {
        prefix: '/emails',
      },
    }]);
```

- create email templates. Email templates are React components that take in an object with all data required by the template. For example we'll create a template called `DummyMessage.jsx` and save it under the `src/views/` folder:

```jsx
import React, { PropTypes } from 'react';
import Layout from 'makeen-mailer/build/views/Layout';

const DummyMessage = ({ messageBody, receiverName }) => (
  <Layout>
    <h1>Hello {receiverEmail}!</h1>
    <p>
      {messageBody}
    </p>
  </Layout>
);

DummyMessage.propTypes = {
  receiverEmail: PropTypes.string.isRequired,
  messageBody: PropTypes.string.isRequired,
};

export default DummyMessage;
```

- Finally you can use above template and email plugin to send emails from different parts of your appliction:

```js
  serviceBus.dispatch('emailer.Mail.send', {
      to: 'gmail.user2@gmail.com',
      subject: 'This is a dummy message send from makeen-mailer',
      template: 'DummyMessage',
      context: {
        receiverName: 'accounts@makeen.io',
        messageBody: 'This mailing plugin is realy awesome!',
      },
    });
```


Because Makeen is a collection of plugins you will need a [Hapi.js](https://hapijs.com/) server to load and run them. To speed things up Makeen is providing the server component in the shape of a [boilerplate](https://github.com/makeen-project/boilerplate) which you can clone and install.

