import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import configureStore, { history } from './store'
import { ConnectedRouter } from 'connected-react-router'
import NavBar from './components/NavBar/NavBar'
import { BodyWrapper } from './utitlities/styles'

const OnlyNavBar = () => (
  <BodyWrapper>
    <NavBar/>
  </BodyWrapper>
);
ReactDOM.render(
  <Provider store={configureStore()}>
    <Suspense fallback={<OnlyNavBar/>}>
      <ConnectedRouter history={history}>
        <App/>
      </ConnectedRouter>
    </Suspense>
  </Provider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
