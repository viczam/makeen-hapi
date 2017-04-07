import React from 'react';
import { render } from 'react-dom';

const rootElement = document.getElementById('root');

const Root = () => (
  <div>It works!!!</div>
);

render(<Root />, rootElement);
