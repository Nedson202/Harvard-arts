import React, { Fragment, PureComponent } from 'react';

import { IImageCardProps } from '../../../types';
import Spinner from '../Preloader/Spinner';

class ImageCard extends PureComponent<IImageCardProps> {
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

    if (!imageLoaded && !loadedErrorMessage.length) {
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

    if (loadedErrorMessage.length) {
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
          <p className='center truncate-overflow'>{title}</p>
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
