import React, { Component } from 'react';
import { Popover } from 'antd';
import marker from '../../assets/marker.png';

interface IProps {
  text: string;
}

class Pointer extends Component<IProps> {
  public render() {
    const { text } = this.props;
    return (
      <Popover content={text} placement='right'>
        <img src={marker} alt='location-marker' className='marker' />
      </Popover>
    );
  }
}

export default Pointer;
