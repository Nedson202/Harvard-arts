import React, { Component, Fragment } from 'react';

import Spinner from '../Preloader/Spinner';
import { IImageCardProps } from '../../../types';

class ImageCard extends Component<IImageCardProps> {
  public state = {
    loadedErrorMessage: '',
    imageUrl: '',
    imageLoaded: false,
  };

  public handleImageLoadError = () => {
    this.setState({
      loadedErrorMessage: 'Unable to fetch image',
      imageUrl: 'https://picfsum.photos/230/300/?random',
    });
  }

  public imageRenderedStatus = (image: string) => () => {
    this.setState({
      imageLoaded: true,
      imageUrl: image,
      loadedErrorMessage: '',
    });
  }

  public renderImage(image: string, title: any) {
    const { imageLoaded, loadedErrorMessage, imageUrl } = this.state;

    if (!imageLoaded && loadedErrorMessage.length === 0) {
      return (
        <div className='image-loader'>
          <Spinner />
          <img
            src={image || ''}
            className='hide'
            onLoad={this.imageRenderedStatus(image)}
            onError={this.handleImageLoadError}
            alt='userImage'
          />
        </div>
      );
    }

    if (loadedErrorMessage.length !== 0) {
      return (
        <span className='image-error-placeholder'>
          <h1>{loadedErrorMessage}</h1>
          <span className='error-symbol'>!</span>
        </span>
      );
    }

    return (
      <Fragment>
        <img
          src={imageUrl}
          className='image'
          alt='Random cap'
        />

        <div className={title && 'child'}>
          <p className='center'>{title}</p>
        </div>
      </Fragment>
    );
  }

  public render() {
    const { imageData: { primaryimageurl, title } } = this.props;

    return (
      <div>
        {this.renderImage(primaryimageurl, title)}
      </div>
    );
  }
}

export default ImageCard;
