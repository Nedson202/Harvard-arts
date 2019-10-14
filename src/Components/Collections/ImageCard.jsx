import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../Preloader/Spinner';

class ImageCard extends Component {
  state = {
    loadedErrorMessage: '',
    imageUrl: '',
    imageLoaded: false
  };

  handleImageLoadError = () => {
    this.setState({
      loadedErrorMessage: 'Unable to fetch image',
      imageUrl: 'https://picfsum.photos/230/300/?random'
    });
  };

  imageRenderedStatus = image => () => {
    this.setState({
      imageLoaded: true,
      imageUrl: image,
      loadedErrorMessage: ''
    });
  };

  renderImage(image, title) {
    const { imageLoaded, loadedErrorMessage, imageUrl } = this.state;
    return (
      <Fragment>
        {!imageLoaded && loadedErrorMessage.length === 0 && (
          <div className="image-loader">
            <Spinner />
            <img
              src={image || ''}
              className="hide"
              onLoad={this.imageRenderedStatus(image)}
              onError={this.handleImageLoadError}
              alt="userImage"
            />
          </div>
        )}
        {loadedErrorMessage.length !== 0 && (
          <span className="image-error-placeholder">
            <h1>{loadedErrorMessage}</h1>
            <span className="error-symbol">!</span>
          </span>
        )}
        {imageLoaded && loadedErrorMessage.length === 0 && (
          <Fragment>
            <img
              src={imageUrl}
              className="image"
              alt="Random cap"
              onLoad={this.imageRenderedStatus}
            />

            <div className={title && 'child'}>
              <p className="center">{title}</p>
            </div>
          </Fragment>
        )}
      </Fragment>
    );
  }

  render() {
    const { imageData: { primaryimageurl, title } } = this.props;
    return (
      <div>
        {this.renderImage(primaryimageurl, title)}
      </div>
    );
  }
}

ImageCard.propTypes = {
  imageData: PropTypes.object.isRequired,
};

export default ImageCard;
