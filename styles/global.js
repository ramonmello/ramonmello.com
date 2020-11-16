import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html {
    font-size: 62.5%;
  }

  body {
    font-family: --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #282C34;
    background: linear-gradient(270deg, #f1f1f1 0%, #f9f9f9 100%);
    animation: fadein 2s;
  }

 a {
   color: inherit;
   text-decoration: none;
 }
`

export default GlobalStyle