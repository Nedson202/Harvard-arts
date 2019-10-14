import React, { Component } from 'react';
import { Skeleton } from 'antd';

class SkeletonScreen extends Component {
  render() {
    return (
      <div className="skeleton-screen">
        <Skeleton active />
      </div>
    );
  }
}

export default SkeletonScreen;
