import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

class Form extends Component { // eslint-disable-line
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
  };

  render() {
    const { invalid, error } = this.context._reduxForm; // eslint-disable-line no-underscore-dangle
    const { children, className, ...restProps } = this.props;

    return (
      <form
        className={classNames(
          'ui form',
          { error: invalid || error },
          className,
        )}
        {...restProps}
      >
        {error &&
          <div className="ui error message">
            <div className="header">Submit failed!</div>
            <p>{error}</p>
          </div>
        }
        {children}
      </form>
    );
  }
}

export default Form;
