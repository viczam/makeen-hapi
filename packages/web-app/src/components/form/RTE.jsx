import React, { Component, PropTypes } from 'react';
import RichTextEditor from 'react-rte';
import styled from 'styled-components';
import pick from 'lodash/pick';

class RTE extends Component { // eslint-disable-line
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    onChange: () => {},
    value: '',
  }

  constructor(props) {
    super(props);

    console.log(props);

    this.state = {
      value: RichTextEditor.createValueFromString(props.value, 'html'),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value.toString('html')) {
      this.setState({
        value: this.state.value.setContentFromString(nextProps.value, 'html'),
      });
    }
  }

  handleChange = (value) => {
    this.setState({ value }, () => {
      this.props.onChange(value.toString('html'));
    });
  }

  render() {
    const { value } = this.state;
    const restProps = pick(this.props, ['autoFocus', 'placeholder']);

    return (
      <div className={this.props.className}>
        <RichTextEditor
          value={value}
          onChange={this.handleChange}
          {...restProps}
        />
      </div>
    );
  }
}

export default styled(RTE)`
  .ui.form & select {
    height: 30px;
    padding: inherit;
    background: inherit;
    border-width: 4px 35px 4px 12px;
  }
`;
