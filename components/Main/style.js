import styled  from 'styled-components'

export const Main = styled.main`
  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  animation: fadein 2s;
`

export const Title = styled.h1`
  font-size: 9.6rem;
  font-weight: 300;
  letter-spacing: -0.36rem;
  b {
    background-color: #e9bcb7;
    background-image: linear-gradient(315deg, #e9bcb7 0%, #29524a 74%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`

export const Subtitle = styled.h3`
  font-size: 2.6rem;
  font-weight: 300;
  padding-bottom: 20rem;
`
