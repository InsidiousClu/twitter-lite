import { composeBundles } from 'redux-bundler';

import extraArgs from './extra-args';
import router from './router';
import auth from './auth/bundle';
import user from './user/bundle';
import tweets from './tweets/bundle';
import search from './search/bundle';
import sessionTicker from './session-ticker/bundle';
import broker from './broker';

export default composeBundles(router, extraArgs, user, auth, broker, sessionTicker, tweets, search);
