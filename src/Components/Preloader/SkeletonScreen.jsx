import React from 'react';
import { Skeleton } from 'antd';

const SkeletonScreen = () => {
  return (
    <div className="skeleton-screen">
      <Skeleton active />
    </div>
  );
};

export default SkeletonScreen;
