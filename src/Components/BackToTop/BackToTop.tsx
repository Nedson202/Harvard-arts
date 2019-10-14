import React, { PureComponent, Fragment } from 'react';
import './backToTop.scss';
import { Icon } from 'antd';
import { minimumScrollDistance } from '../../utils';

interface IState {
  displayBackToTop: boolean;
}

class BackToTop extends PureComponent<IState> {
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
    window.addEventListener('scroll', this.handlePageScroll, {
      capture: true,
      passive: true,
    });
  }

  public componentWillUnmount() {
    (window.addEventListener as (
      type: string,
      listener: (event: Event) => void,
      options?: { capture?: boolean, passive?: boolean },
    ) => void)('scroll', this.handlePageScroll, {
      capture: true,
      passive: true,
    });
  }

  private handlePageScroll = () => {
    if (document.body.scrollTop < minimumScrollDistance
      || document.documentElement.scrollTop < minimumScrollDistance) {
      this.setState({ displayBackToTop: false });
    }
    if (document.body.scrollTop > minimumScrollDistance
      || document.documentElement.scrollTop > minimumScrollDistance) {
      this.setState({ displayBackToTop: true });
    }
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
