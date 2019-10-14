import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

import './collection.scss';
import SkeletonScreen from '../Preloader/SkeletonScreen';
import BackToTop from '../BackToTop';

import { singleObjectQuery } from '../Collections/query';
import {
  fieldsNeeded, networkOnly, backgroundOverlay,
  cancelBackgroundOverlay, notAvailableText, navBarElement, noDisplay,
} from '../../settings';

class Collection extends Component {
  state = {
    fullImageVisible: false,
  };

  UNSAFE_componentWillMount() {
    document.addEventListener("mousedown", this.handleClickOutsideFullImage, false);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutsideFullImage, false);
    document.body.style.background = cancelBackgroundOverlay;
  }

  handleClickOutsideFullImage = (event) => {
    if (this.node && this.node.contains(event.target)) {
      return;
    }

    this.cancelImageDisplay();
  }

  handleFullImageDisplay = () => {
    document.body.style.background = backgroundOverlay;

    this.setState({ fullImageVisible: true });
  }

  cancelImageDisplay = () => {
    const navBar = document.getElementById(navBarElement);
    if (!navBar) {
      return;
    }

    this.setState({ fullImageVisible: false });

    document.body.style.overflow = 'scroll';
    navBar.style.background = 'white';
    document.body.style.background = 'unset';
  }

  contextualText(values) {
    return (
      <Fragment>
        {
          values.map(value => (
            <div key={value.context}>
              <h1>{value.context}</h1>
              <p>{value.text}</p>
            </div>
          ))
        }
      </Fragment>
    );
  }

  technicalDetails(details) {
    return (
      <Fragment>
        {
          details.map(detail => (
            <p key={details}>{detail.text}</p>
          ))
        }
      </Fragment>
    );
  }


  groupData(record) {
    const keysInRecord = record && Object.keys(record);

    const finalData = {};

    if (record) {
      fieldsNeeded.forEach((element) => {
        if (keysInRecord.includes(element)) {
          finalData[element] = record[element];
        }
      });
    }

    return finalData;
  }

  toggleFullImageView = (value) => {
    const { fullImageVisible } = this.state;
    const navElement = document.getElementById(navBarElement);

    if (!fullImageVisible || !navElement) {
      return;
    }

    navElement.style.background = noDisplay;
    document.body.style.overflowY = 'hidden';

    return (
      <div className="fullImage-display" ref={node => this.node = node}>
        <span
          tabIndex={0}
          role="button"
          className="image-close-icon"
          onClick={this.cancelImageDisplay}
        >
          <Icon type="close" />
        </span>
        <img
          onMouseOver={this.handleFullImageDisplay}
          src={value.primaryimageurl}
          alt='collection pix-file on display'
          onFocus={() => 0}
          id="fullImage"
        />
      </div>
    )
  }

  render() {
    const { match: { params: { id } } } = this.props;
    let loadedData;
    return (
      <Query
        query={singleObjectQuery}
        variables={{ id }}
        fetchPolicy={networkOnly}
      >
        {({ loading, error, data: { object: { record } = {} } = {} }) => {
          if (loading) {
            loadedData = <SkeletonScreen />;
          }
          if (!loading) {
            const value = this.groupData(record);
            loadedData = (
              <Fragment>
                <h1 className="collection-header center">
                  <img
                    onClick={() => this.handleFullImageDisplay()}
                    src={value.primaryimageurl}
                    className="preview-image"
                    height="100px" width="100px" alt=""
                  />
                  {value.title}
                </h1>

                {this.toggleFullImageView(value)}

                <section className="collection-data">
                  <div>
                    <h1 className="collection-data__head">Details</h1>
                    <span className="collection-data__para">
                      {value.details
                        ? this.technicalDetails(value.details.technical) : <p>{notAvailableText}</p>}
                    </span>
                    <div className="collection-data__group">
                      <div className="collection-data__group-layer1" id="center">
                        <h2 className="center">Accession Method</h2>
                        <p>{value.accessionmethod || notAvailableText}</p>
                      </div>
                      <div className="collection-data__group-layer1">
                        <h2 className="center">Accession Year</h2>
                        <p>{value.accessionyear || notAvailableText}</p>
                      </div>
                      <div className="collection-data__group-layer1">
                        <h2 className="center">Century</h2>
                        <p>{value.century || notAvailableText}</p>
                      </div>
                      <div className="collection-data__group-layer1">
                        <h2 className="center">Classification</h2>
                        <p>{value.classification || notAvailableText}</p>
                      </div>
                    </div>

                    <h1 className="collection-data__head">Contextual Text</h1>
                    <span className="collection-data__para">
                      {value.contextualtext
                        ? this.contextualText(value.contextualtext) : <p>{notAvailableText}</p>}

                    </span>

                    <div className="collection-data__group">
                      <div className="collection-data__group-layer2">
                        <h2 className="center">Culture</h2>
                        <p>{value.culture || notAvailableText}</p>
                      </div>
                      <div className="collection-data__group-layer2">
                        <h2 className="center">Department</h2>
                        <p>{value.department || notAvailableText}</p>
                      </div>
                      <div className="collection-data__group-layer2">
                        <h2 className="center">Medium</h2>
                        <p>{value.medium || notAvailableText}</p>
                      </div>
                    </div>

                    <h1 className="collection-data__head">Provenance</h1>
                    <span className="collection-data__para">
                      <p>
                        {value.provenance
                          ? value.provenance : notAvailableText}
                      </p>
                    </span>
                  </div>
                </section>
              </Fragment>
            );
          }
          if (error) {
            loadedData = (
              <Fragment>
                <h1>Sorry an error occurred</h1>
              </Fragment>
            );
          }

          return (
            <Fragment>
              <div className="collection">
                {loadedData}
              </div>
              <BackToTop />
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

Collection.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Collection;
