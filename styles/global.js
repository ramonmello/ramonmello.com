import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Ubuntu';
    font-style: normal;
    font-weight: 300;
    font-display: swap;
    src: local('Ubuntu'),
      url('../public/fonts/ubuntu-v15-latin-300.woff2') format('woff2'),       
      url('../public/fonts/ubuntu-v15-latin-300.woff') format('woff'),       
  }
  
  @font-face {
    font-family: 'Ubuntu';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('Ubuntu'),
      url('../public/fonts/ubuntu-v15-latin-regular.woff2') format('woff2'),        
      url('../public/fonts/ubuntu-v15-latin-regular.woff') format('woff'),        
  }
  
  @font-face {
    font-family: 'Ubuntu';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: local('Ubuntu'),
      url('../public/fonts/ubuntu-v15-latin-700.woff2') format('woff2'),        
      url('../public/fonts/ubuntu-v15-latin-700.woff') format('woff'),        
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    font-size: 62.5%;
  }

  body {
    font-family: 'Ubuntu', --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #282C34;
  }

 a {
   color: inherit;
   text-decoration: none;
 }

 ::-webkit-scrollbar {
  width: 1.6rem;
}

::-webkit-scrollbar-thumb {
  background: #c9c9c9;
  border-radius: 1rem;
}
`

export default GlobalStyle