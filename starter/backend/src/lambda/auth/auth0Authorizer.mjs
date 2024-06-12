import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJV7sneCEFVrf3MA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi0xa2s3ZHRqaHByMzA0cXU3LnVzLmF1dGgwLmNvbTAeFw0yNDA2MDgw
ODMwMjlaFw0zODAyMTUwODMwMjlaMCwxKjAoBgNVBAMTIWRldi0xa2s3ZHRqaHBy
MzA0cXU3LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBALeTKhaqecUmsYpOipD1cWekzGVnXu2IIKrdKIAwELOCHBKxKGQmVsEUl1mJ
Cnw/prIFdS0X+ElUrvbbKkTCjwP/eX9FBDkV7lwgJbKDgf2FPffwPAp0SMi+PaVw
W/8vFRFWGgokPBWgX8Or8GNUODReECYIrqKtMRn6cBStmtJIxks0PMAiQ5qnZC2/
iR7aiQ+ANAFZzGNa+aUTdtsGpJqhKfb0lsUHdGa8D/zSj6ioVwmyHm0d9HePivZs
NjJZH/5LDaqkTnm8kcl8FpuPyRliL3erSylB+GSDtr/em9T5Ks2rRpcKsurAMyv3
vfXTer/zX3Trw6zXrE5efQL4VbECAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQU0zA3gaGoTmCzEpwMqscFzYZtyTswDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQCIQHyRMPDyoOPRevpmMyYANT9Q35bgtzYauR5yGXjC
yPLIA/Tb7AscUZpsuSa+RitDSDVH2ntCT1C+JWOPGYvFvpyaSZdsa7BXHfSDp09f
ellQCJS7rVDQESme6FgYc6ibyUQtjOyiDo+8FV2hjFyQ1KQVhEjmnsb5klmAD+19
r1Qb+kGrx+q4h4GMeJlGcvcwgFLbyYxfm7WbXu5aCDyYEIVyPAk3VNUoWXYgIpid
0csmKuL6EztmU+H2BgJp/BNdIGRpnUrPHON9FlQOJ7QmdKVCwFnZcS+KhM4NuET/
W70n0+WpwZxBledzOZV4ANY/L1k701h9oFWYvWPHzL9G
-----END CERTIFICATE-----`

// const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'
const jwksUrl = 'https://dev-1kk7dtjhpr304qu7.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  // TODO: Implement token verification
  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
