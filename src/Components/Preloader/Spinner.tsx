import React from 'react';
import { Spin, Icon } from 'antd';
import PropTypes from 'prop-types';

import { ISpinnerProps } from '../../../types';

const Spinner = (props: ISpinnerProps) => {
  let spinnerTip = 'Loading...';
  const { disableTip, size } = props;
  const antIcon = (
    <Icon
      type='loading'
      style={{ fontSize: size }}
      spin={true}
    />
  );

  if (disableTip) {
    spinnerTip = '';
  }

  return (
    <Spin
      indicator={antIcon}
      tip={spinnerTip}
    />
  );
};

Spinner.propTypes = {
  disableTip: PropTypes.bool,
  size: PropTypes.number,
};

Spinner.defaultProps = {
  disableTip: false,
  size: 40,
};

export default Spinner;
