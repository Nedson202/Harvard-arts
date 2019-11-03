import React from 'react';

import { Popover } from 'antd';

import { IPointerProps } from '../../../types';
import marker from '../../assets/marker.png';

const Pointer = (props: IPointerProps) => {
  const { text } = props;

  return (
    <Popover content={text} placement='right'>
      <img src={marker} alt='location-marker' className='marker' />
    </Popover>
  );
};

export default Pointer;
