import { composeBundles } from 'redux-bundler';

import extraArgs from './extra-args'
import router from './router';
import auth from './auth/bundle';

export default composeBundles(router, extraArgs, auth)