import styled  from 'styled-components'

export const Main = styled.main`
  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  animation: fadein 2s;
`

export const Title = styled.h1`
  font-size: 6.4rem;
  font-weight: 300;
  letter-spacing: -0.16rem;
  .name {
    background-color: #e9bcb7;
    background-image: linear-gradient(315deg, #e9bcb7 0%, #29524a 74%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`

export const Subtitle = styled.h3`
  font-size: 3.2rem;
  font-weight: 300;
  padding-bottom: 20rem;
  padding-left: 0.32rem;
  letter-spacing: -0.08rem;
`

export const SctionTitle = styled.h3`
  font-size: 3.2rem;
  font-weight: 300;
  padding-bottom: 2rem;
  letter-spacing: -0.08rem;
`

export const TextParagraph = styled.p`
  font-size: 1.6rem;
  font-weight: 300;
  padding-bottom: 2rem;
`