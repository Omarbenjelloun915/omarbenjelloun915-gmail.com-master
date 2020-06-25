import React from 'react';
import loginImg from '../../img/login.svg';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className='base-container' ref={this.props.containerRef}>
        <div className='header'>Login</div>
        <div className='content'>
          <div className='image'>
            <img src={loginImg} />
          </div>
          <div className='form'>
            <div className='form-group'>
              <label htmlFor='username'>Username</label>
              <input
                type='text'
                name='username'
                placeholder='username'
                value={this.state.username}
                onChange={this.onChange}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                name='password'
                placeholder='password'
                value={this.state.password}
                onChange={this.onChange}
              />
            </div>
          </div>
        </div>
        <div className='footer'>
          <button type='button' className='btn'>
            Login
          </button>
        </div>
      </div>
    );
  }
}
