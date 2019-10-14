import React, { PureComponent, Fragment } from 'react';
import { Icon } from 'antd';

import './backToTop.scss';
import { MINIMUM_SCROLL_DISTANCE, SCROLL } from '../../settings';

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

  private handlePageScroll = () => {
    let displayBackToTop = false;

    if (document.body.scrollTop > MINIMUM_SCROLL_DISTANCE
      || document.documentElement.scrollTop > MINIMUM_SCROLL_DISTANCE) {
      displayBackToTop = true;
    }

    if (document.body.scrollTop < MINIMUM_SCROLL_DISTANCE
      || document.documentElement.scrollTop < MINIMUM_SCROLL_DISTANCE) {
      displayBackToTop = false;
    }

    this.setState({ displayBackToTop });
  }

  private scrollToTop = () => {
    window.scroll({
      top: 0,
      left: 100,
      behavior: 'smooth',
    });
  }

  private renderBackToTop = (displayBackToTop: boolean) => displayBackToTop && (
    <button
      type='button'
      className='btn btn-secondary bmd-btn-fab back-to-top'
      onClick={this.scrollToTop}
    >
      <Icon type='caret-up' />
    </button>
  )
}

export default BackToTop;
