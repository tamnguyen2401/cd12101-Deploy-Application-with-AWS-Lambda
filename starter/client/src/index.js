import { Auth0Provider } from '@auth0/auth0-react'
import { createRoot } from 'react-dom/client';
import React from 'react'
// import ReactDOM from 'react-dom'
import 'semantic-ui-css/semantic.min.css'
import App from './App'
import './index.css'

const domain = process.env.REACT_APP_AUTH0_DOMAIN
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID
const root = createRoot(document.getElementById('root'));

root.render(
// ReactDOM.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={window.location.origin}
    audience={`https://${domain}/api/v2/`}
    useRefreshTokens={true}
    cacheLocation={'localstorage'}
    scope="offline_access read:todos write:todo delete:todo"
  >
    <App />
  </Auth0Provider>,
  // document.getElementById('root')
)
