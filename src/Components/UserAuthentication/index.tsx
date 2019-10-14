import React, { Component, Fragment } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import './authentication.scss';
import {
  NO_DISPLAY, ANT_ICON_COLOR, WHITE_BACKGROUND,
  FORM_ELEMENT, NAV_BAR_ELEMENT, SCROLL,
} from '../../settings';

interface IProps {
  form: any;
}

class NormalLoginForm extends Component<IProps, any> {
  public state = {
    formOnDisplay: 'Login',
  };

  public handleSubmit = (event: any) => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields((error: any, values: any) => {
      if (!error) {
        console.log('Received values of form: ', values);
      }
    });
  }

  public closeForm = () => {
    const formParent = document.getElementById(FORM_ELEMENT);
    const navBar = document.getElementById(NAV_BAR_ELEMENT);

    if (!formParent || !navBar) {
      return;
    }

    formParent.style.display = NO_DISPLAY;
    document.body.style.overflow = SCROLL;
    document.body.style.background = WHITE_BACKGROUND;
  }

  public toggleForm = () => {
    const { formOnDisplay } = this.state;
    let modifiedFormOnDisplay;

    if (formOnDisplay === 'Login') {
      modifiedFormOnDisplay = 'Signup';
    }

    if (formOnDisplay === 'Signup') {
      modifiedFormOnDisplay = 'Login';
    }
    this.setState({ formOnDisplay: modifiedFormOnDisplay });
  }

  public renderActionText = () => {
    const { formOnDisplay } = this.state;
    let actionText = 'register now!';
    if (formOnDisplay !== 'Login') {
      actionText = 'login now!';
    }
    return (
      <Fragment>
        Or <a onClick={this.toggleForm}>{actionText}</a>
      </Fragment>
    );
  }

  public render() {
    const { form: { getFieldDecorator } } = this.props;
    const { formOnDisplay } = this.state;
    return (
      <div className='form-parent' id='form'>
        <span
          className='form-close-icon'
        >
          <Icon
            type='close'
            style={{ color: ANT_ICON_COLOR }}
            onClick={this.closeForm}
          />
        </span>
        <h1 className='form-type'>{formOnDisplay}</h1>
        <Form onSubmit={this.handleSubmit} className='login-form'>
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: 'Please input a valid Email!',
              }],
            })(
              <Input
                prefix={<Icon type='user' style={{ color: ANT_ICON_COLOR }} />}
                placeholder='Email'
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input
                prefix={<Icon type='lock' style={{ color: ANT_ICON_COLOR }} />}
                type='password'
                placeholder='Password'
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button htmlType='submit' className='login-form-button'>
              Continue
            </Button>
            {this.renderActionText()}
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const AuthenticationForm = Form.create({ name: 'normal_login' })(NormalLoginForm);
export default AuthenticationForm;
