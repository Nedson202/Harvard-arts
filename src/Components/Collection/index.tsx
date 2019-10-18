import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { Icon } from 'antd';

import './collection.scss';
import SkeletonScreen from '../Preloader/SkeletonScreen';
import BackToTop from '../BackToTop';

import { singleObjectQuery } from '../Collections/query';
import {
  FIELDS_NEEDED, NETWORK_ONLY, BACKGROUND_OVERLAY, CANCEL_BACKGROUND_OVERLAY,
  NOT_AVAILABLE_MESSAGE, NAV_BAR_ELEMENT, NO_DISPLAY, SCROLL, MOUSE_DOWN,
} from '../../settings';

import {
  CollectionDetail, CollectionProps, ContextualText, CollectionGroupValue,
  FullImageViewValue,
} from '../../../types';

class Collection extends Component<CollectionProps> {
  public state = {
    fullImageVisible: false,
  };

  public node: any;

  public componentDidMount() {
    window.addEventListener(MOUSE_DOWN, this.handleClickOutsideFullImage, false);
  }

  public componentWillUnmount() {
    window.removeEventListener(MOUSE_DOWN, this.handleClickOutsideFullImage, false);
    document.body.style.background = CANCEL_BACKGROUND_OVERLAY;
  }

  public handleClickOutsideFullImage = (event: any) => {
    if (this.node && this.node.contains(event.target)) {
      return;
    }

    this.cancelImageDisplay();
  }

  public handleFullImageDisplay = () => {
    document.body.style.background = BACKGROUND_OVERLAY;

    this.setState({ fullImageVisible: true });
  }

  public cancelImageDisplay = () => {
    const navBar = document.getElementById(NAV_BAR_ELEMENT);

    if (!navBar) {
      return;
    }

    this.setState({ fullImageVisible: false });

    document.body.style.overflow = SCROLL;
    navBar.style.background = 'white';
    document.body.style.background = 'unset';
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

  public toggleFullImageView = (value: CollectionGroupValue) => {
    const { fullImageVisible } = this.state;
    const navElement = document.getElementById(NAV_BAR_ELEMENT);

    if (!fullImageVisible || !navElement) {
      return;
    }

    navElement.style.background = NO_DISPLAY;
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
          onMouseOver={this.handleFullImageDisplay}
          src={value.primaryimageurl}
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
                <h1 className='collection-header center'>
                  <img
                    alt=''
                    className='preview-image'
                    height='100px'
                    onClick={this.handleFullImageDisplay}
                    src={value.primaryimageurl}
                    width='100px'
                  />
                  {value.title}
                </h1>

                {this.toggleFullImageView(value)}

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
              <Fragment>
                <h1>Sorry an error occurred</h1>
              </Fragment>
            );
          }

          return (
            <Fragment>
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
