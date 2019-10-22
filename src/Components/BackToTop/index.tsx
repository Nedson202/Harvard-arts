import React, { PureComponent, Fragment } from 'react';
import { Icon } from 'antd';

import './backToTop.scss';
import { SCROLL } from '../../settings';

import { IBackToTopState } from '../../../types';

class BackToTop extends PureComponent<any, IBackToTopState> {
  public state = {
    displayBackToTop: false,
  };

  public render() {
    const { displayBackToTop } = this.state;

    return (
      <Fragment>
        {this.renderBackToTop(displayBackToTop)}
      </Fragment>
    );
  }

  public componentDidMount() {
    window.addEventListener(SCROLL, this.handlePageScroll, {
      capture: true,
      passive: true,
    });
  }

  public componentWillUnmount() {
    window.addEventListener(SCROLL, this.handlePageScroll, {
      capture: true,
      passive: true,
    });
  }

  public handlePageScroll = () => {
    const shouldDisplayBackToTop = window.scrollY > 300;

    this.setState({ displayBackToTop: shouldDisplayBackToTop });
  }

  public scrollToTop = () => {
    window.scroll({
      top: 0,
      left: 100,
      behavior: 'smooth',
    });
  }

  public renderBackToTop = (displayBackToTop: boolean) => displayBackToTop && (
    <button
      className='btn btn-secondary back-to-top'
      onClick={this.scrollToTop}
      type='button'
    >
      <Icon type='caret-up' />
    </button>
  )
}

export default BackToTop;
