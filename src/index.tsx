import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';

import store from './app/store'

import './index.css'

import { getIssues, getIssue } from './graphql/index'

const render = async () => {

  const App = require('./app/App').default

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>, document.getElementById('root')
  )
}

render()

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./app/App', render)
}