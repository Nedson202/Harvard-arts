import React, { Component } from 'react';
import { Popover } from 'antd';

import marker from '../../assets/marker.png';
import { IPointerProps } from '../../../types';

const Pointer = (props: IPointerProps) => {
  const { text } = props;

  return (
    <Popover content={text} placement='right'>
      <img src={marker} alt='location-marker' className='marker' />
    </Popover>
  );
};

export default Pointer;
