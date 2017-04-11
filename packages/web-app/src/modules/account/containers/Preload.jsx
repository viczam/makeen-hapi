import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Dimmer, Loader } from 'semantic-ui-react';
import * as actions from '../redux/actionCreators';

class Preload extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    preload: PropTypes.func.isRequired,
  };

  state = {
    isLoading: true,
    error: null,
  };

  componentDidMount() {
    this.props.preload().then(
      () => this.setState({ isLoading: false }),
      (error) => this.setState({ error }),
    );
  }

  render() {
    const { isLoading, error } = this.state;

    if (error) {
      return (
        <div>{error}</div>
      );
    }

    return (
      <Dimmer.Dimmable dimmed={isLoading}>
        <Dimmer active={isLoading} inverted>
          <Loader>Loading</Loader>
        </Dimmer>
        {!isLoading && this.props.children}
      </Dimmer.Dimmable>
    );
  }
}

export default connect(null, actions)(Preload);
