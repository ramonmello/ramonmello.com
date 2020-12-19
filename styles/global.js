import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Fira Sans';
    font-style: normal;
    font-weight: 300;
    src: local(''),
        url('/fonts/fira-sans-v10-latin-300.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Fira Sans';
    font-style: normal;
    font-weight: 400;
    src: local(''),
        url('/fonts/fira-sans-v10-latin-regular.woff2') format('woff2');  
  }

  @font-face {
    font-family: 'Fira Sans';
    font-style: normal;
    font-weight: 700;
    src: local(''),
        url('/fonts/fira-sans-v10-latin-700.woff2') format('woff2');    
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
    font-family: 'Fira Sans';
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