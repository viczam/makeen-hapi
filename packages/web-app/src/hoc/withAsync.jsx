import React, { Component } from 'react';
import { Loader, Message } from 'semantic-ui-react';

const withAsync = (runProps) => (WrappedComponent) => {
  class AsyncComponent extends Component {
    state = {
      isLoading: true,
      error: null,
      response: null,
    }

    componentDidMount() {
      Promise.resolve(runProps(this.props)).then(
        (response) => this.setState({ response, isLoading: false }),
        (error) => this.setState({ error, isLoading: false }),
      );
    }

    render() {
      const { isLoading, error } = this.state;

      if (isLoading) {
        return (
          <Loader active inline="centered" />
        );
      }

      if (error) {
        return (
          <Message negative>
            <Message.Header>An error occurred.</Message.Header>
            <p>{error}</p>
          </Message>
        );
      }

      return (
        <WrappedComponent {...this.props} {...this.state} />
      );
    }
  }

  return AsyncComponent;
};

export default withAsync;
