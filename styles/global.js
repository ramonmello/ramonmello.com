import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
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
    background: linear-gradient(270deg, rgba(255, 255, 255, 0.5) 0%, #F1F1F1 100%);
  }

 a {
   color: inherit;
   text-decoration: none;
 }
`

export default GlobalStyle