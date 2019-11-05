import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';

import { Icon } from 'antd';

import './collection.scss';

import BackToTop from '../BackToTop';
import SkeletonScreen from '../Preloader/SkeletonScreen';

import { singleObjectQuery } from '../Collections/query';

import {
  FIELDS_NEEDED, MOUSE_DOWN, NAV_BAR_ELEMENT, NETWORK_ONLY,
  NOT_AVAILABLE_MESSAGE, SCROLL,
} from '../../settings';

import {
  CollectionDetail, CollectionGroupValue, CollectionProps, ContextualText,
} from '../../../types';

class Collection extends Component<CollectionProps> {
  public state = {
    fullImageVisible: false,
    primaryImageUrl: '',
  };

  public node: any;

  public componentDidMount() {
    window.addEventListener(MOUSE_DOWN, this.handleClickOutsideFullImage, false);
  }

  public componentWillUnmount() {
    window.removeEventListener(MOUSE_DOWN, this.handleClickOutsideFullImage, false);
  }

  public handleClickOutsideFullImage = (event: any) => {
    if (this.node && this.node.contains(event.target)) {
      return;
    }

    this.cancelImageDisplay();
  }

  public handleFullImageDisplay = (value: CollectionGroupValue) => () => {
    window.scrollTo({
      top: 0,
    });

    this.setState({
      fullImageVisible: true,
      primaryImageUrl: value.primaryimageurl,
    }, () => {
      const zoomContainer = document.querySelector('.fullImage-display');

      if (zoomContainer) {
        zoomContainer.setAttribute('id', 'image-zoom');
        return;
      }
    });
  }

  public cancelImageDisplay = () => {
    const { fullImageVisible } = this.state;

    if (!fullImageVisible) {
      return;
    }

    document.body.style.overflow = SCROLL;

    this.setState({ fullImageVisible: false });
  }

  public contextualText(values: ContextualText[]) {
    return (
      <Fragment>
        {
          values.map((value: ContextualText) => (
            <div key={value.context}>
              <h1>{value.context}</h1>
              <p>{value.text}</p>
            </div>
          ))
        }
      </Fragment>
    );
  }

  public technicalDetails(details: CollectionDetail[]) {
    const mappedDetails = details.map((detail: CollectionDetail) => (
      <p>{detail.text}</p>
    ));

    return (
      <Fragment>
        {mappedDetails}
      </Fragment>
    );
  }


  public groupData(record: CollectionGroupValue) {
    const keysInRecord: string[] = record && Object.keys(record);

    const finalData: CollectionGroupValue = {};

    if (record) {
      FIELDS_NEEDED.forEach((element: string) => {
        if (keysInRecord.includes(element)) {
          const recordData: any = record[element];
          finalData[element] = recordData;
        }
      });
    }

    return finalData;
  }

  public returnVoid = () => 0;

  public toggleFullImageView = () => {
    const { fullImageVisible, primaryImageUrl } = this.state;
    const navElement = document.getElementById(NAV_BAR_ELEMENT);

    if (!fullImageVisible || !navElement) {
      return;
    }

    document.body.style.overflowY = 'hidden';

    return (
      <div className='fullImage-display' ref={(node) => this.node = node}>
        <span
          className='image-close-icon'
          onClick={this.cancelImageDisplay}
          role='button'
          tabIndex={0}
        >
          <Icon type='close' />
        </span>
        <img
          alt='collection pix-file on display'
          id='fullImage'
          onFocus={this.returnVoid}
          src={primaryImageUrl}
        />
      </div>
    );
  }

  public render() {
    const { match: { params: { id } } } = this.props;
    let loadedData: any;

    return (
      <Query
        query={singleObjectQuery}
        variables={{ id }}
        fetchPolicy={NETWORK_ONLY}
      >
        {({ loading, error, data: { object: { record } = {} as any } = {} }) => {
          if (loading) {
            loadedData = <SkeletonScreen />;
          }
          if (!loading) {
            const value = this.groupData(record);

            loadedData = (
              <Fragment>
                <div className='collection-header'>
                  <img
                    alt=''
                    className='collection-header__image'
                    height='100px'
                    onClick={this.handleFullImageDisplay(value)}
                    src={value.primaryimageurl}
                    width='100px'
                  />
                  <h1 className='collection-header__title center'>
                    {value.title}
                  </h1>
                </div>

                <section className='collection-data'>
                  <div>
                    <h1 className='collection-data__head'>Details</h1>
                    <span className='collection-data__para'>
                      {value.details
                        ? this.technicalDetails(value.details.technical)
                        : <p>{NOT_AVAILABLE_MESSAGE}</p>
                      }
                    </span>
                    <div className='collection-data__group'>
                      <div className='collection-data__group-layer1' id='center'>
                        <h2 className='center'>Accession Method</h2>
                        <p>{value.accessionmethod || NOT_AVAILABLE_MESSAGE}</p>
                      </div>
                      <div className='collection-data__group-layer1'>
                        <h2 className='center'>Accession Year</h2>
                        <p>{value.accessionyear || NOT_AVAILABLE_MESSAGE}</p>
                      </div>
                      <div className='collection-data__group-layer1'>
                        <h2 className='center'>Century</h2>
                        <p>{value.century || NOT_AVAILABLE_MESSAGE}</p>
                      </div>
                      <div className='collection-data__group-layer1'>
                        <h2 className='center'>Classification</h2>
                        <p>{value.classification || NOT_AVAILABLE_MESSAGE}</p>
                      </div>
                    </div>

                    <h1 className='collection-data__head'>Contextual Text</h1>
                    <span className='collection-data__para'>
                      {value.contextualtext
                        ? this.contextualText(value.contextualtext) : <p>{NOT_AVAILABLE_MESSAGE}</p>}
                    </span>

                    <div className='collection-data__group'>
                      <div className='collection-data__group-layer2'>
                        <h2 className='center'>Culture</h2>
                        <p>{value.culture || NOT_AVAILABLE_MESSAGE}</p>
                      </div>
                      <div className='collection-data__group-layer2'>
                        <h2 className='center'>Department</h2>
                        <p>{value.department || NOT_AVAILABLE_MESSAGE}</p>
                      </div>
                      <div className='collection-data__group-layer2'>
                        <h2 className='center'>Medium</h2>
                        <p>{value.medium || NOT_AVAILABLE_MESSAGE}</p>
                      </div>
                    </div>

                    <h1 className='collection-data__head'>Provenance</h1>
                    <span className='collection-data__para'>
                      <p>
                        {value.provenance
                          ? value.provenance : NOT_AVAILABLE_MESSAGE}
                      </p>
                    </span>
                  </div>
                </section>
              </Fragment>
            );
          }

          if (error) {
            loadedData = (
              <h1 className='center'>Sorry an error occurred</h1>
            );
          }

          return (
            <Fragment>
              {this.toggleFullImageView()}

              <div className='collection'>
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

export default Collection;
