import { configureStore, Action } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk';

import rootReducer, { RootState } from './rootReducer'

const store = configureStore({ reducer: rootReducer })


/* By using the module.hot API for reloading, we can re-import 
 * the new version of the root reducer function whenever 
 * it's been recompiled, and tell the store to use the new version instead.
 */
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default
    store.replaceReducer(newRootReducer)
  })
}

export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, null, Action<string>> // these are most common settings for ThunkAction
export default store