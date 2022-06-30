// for linkedin login callback

import React from 'react';
import { LinkedInCallback } from 'react-linkedin-login-oauth2';

const callback = () => {
    return (
        <div className='mt-5 pt-5'>
            <LinkedInCallback></LinkedInCallback>
        </div>
    );
};

export default callback;