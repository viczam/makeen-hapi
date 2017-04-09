import React, { PropTypes, Component } from 'react';
import Dropzone from 'react-dropzone';
import omit from 'lodash/omit';

const MultiplePreview = ({ files }) => {
  if (!files.length) {
    return null;
  }

  return (
    <div>
      {files.map((file) => (
        <img key={file.preview} src={file.preview} role="presentation" />
      ))}
    </div>
  );
};

MultiplePreview.propTypes = {
  files: PropTypes.array,
};

const SinglePreview = ({ file }) => {
  if (!file) {
    return null;
  }

  return (
    <div>
      <img src={file.preview} role="presentation" />
    </div>
  );
};

SinglePreview.propTypes = {
  file: PropTypes.any,
};

class Uploader extends Component {
  static propTypes = {
    multiple: PropTypes.bool,
    value: PropTypes.any,
    onChange: PropTypes.func,
    placeholder: PropTypes.node,
    renderPreview: PropTypes.func,
  };

  static defaultProps = {
    multiple: true,
    value: [],
    placeholder: 'Attach files',
  };

  handleDrop = (acceptedFiles) => {
    const { multiple, onChange } = this.props;
    onChange(multiple ? acceptedFiles : acceptedFiles[0]);
  }

  renderPreview() {
    const { multiple, renderPreview, value } = this.props;

    if (renderPreview) {
      return renderPreview(value);
    }

    if (multiple) {
      return (
        <MultiplePreview fiels={value} />
      );
    }

    return (
      <SinglePreview file={value} />
    );
  }

  render() {
    const { placeholder, ...restProps } = this.props;
    const hasValue = this.props.multiple ? this.props.value.length : !!this.props.value;
    const props = omit(restProps, [
      'onChange', 'onBlur', 'onDragStart', 'onDrop', 'onFocus', 'name', 'value', 'renderPreview',
    ]);

    return (
      <div>
        {hasValue && this.renderPreview()}

        <Dropzone
          className="ui button"
          {...props}
          onDrop={this.handleDrop}
        >
          {placeholder}
        </Dropzone>
      </div>
    );
  }
}

export default Uploader;
