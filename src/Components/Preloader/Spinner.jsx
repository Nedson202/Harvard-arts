import React, { Component } from 'react';
import { Spin, Icon } from 'antd';
import PropTypes from 'prop-types';

class Spinner extends Component {
  render() {
    const { disableTip, size } = this.props;
    const antIcon = <Icon type="loading" style={{ fontSize: size }} spin />;
    return (
      <Spin indicator={antIcon} tip={disableTip || 'Loading...'} />
    );
  }
}

Spinner.propTypes = {
  disableTip: PropTypes.bool,
  size: PropTypes.number,
};

Spinner.defaultProps = {
  disableTip: false,
  size: 40
};

export default Spinner;
