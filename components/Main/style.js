import styled  from 'styled-components'
import Section from '../Section'

export const Main = styled.main`
  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  animation: fadein 2s;
`

export const Title = styled.h1`
  font-size: 6.2rem;
  font-weight: 300;
  letter-spacing: -0.16rem;  
  .name {
    background-color: #e9bcb7;
    background-image: linear-gradient(315deg, #e9bcb7 0%, #29524a 74%);
    background-clip: text;
    font-weight: 700;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`

export const Subtitle = styled.h4`
  font-size: 3.2rem;
  font-weight: 300;
  padding-bottom: 20rem;
  letter-spacing: -0.08rem;
`

export const SectionTitle = styled.h3`
  text-align: center;
  font-size: 3.2rem;
  font-weight: 700;
  padding-bottom: 2rem;
  letter-spacing: -0.08rem;
`

export const WelcomeSection = styled(Section)`
  height: 100vh;
  div {
    width: 100vw;
  }
`

export const ProductSection = styled(Section)`  
  margin-bottom: 12.8rem;
`
