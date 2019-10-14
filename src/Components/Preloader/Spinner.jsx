import React from 'react';
import { Spin, Icon } from 'antd';
import PropTypes from 'prop-types';

const Spinner = props => {
  const { disableTip, size } = props;
  const antIcon =
  <Icon
    type="loading"
    style={{ fontSize: size }}
    spin
  />;

  return (
    <Spin
      indicator={antIcon}
      tip={disableTip || 'Loading...'}
    />
  );
};

Spinner.propTypes = {
  disableTip: PropTypes.bool,
  size: PropTypes.number,
};

Spinner.defaultProps = {
  disableTip: false,
  size: 40
};

export default Spinner;
