import React from 'react';
import { Link } from 'react-router-dom';

const landing = () => {
  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>Scientist Connector</h1>
          <p className='lead'>
            Create a scientist profile/portfolio, share posts and get help from
            other scientists
          </p>
          <div className='buttons'>
            <Link to='/register' className='btn btn-primary'>
              Sign Up
            </Link>
            <Link to='/login' className='btn btn-light'>
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default landing;
