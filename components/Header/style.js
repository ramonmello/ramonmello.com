import { InstagramAlt as InstagramIcon } from '@styled-icons/boxicons-logos/InstagramAlt'
import { Github as GithubIcon, Linkedin as LinkedinIcon } from '@styled-icons/fa-brands'
import styled from 'styled-components'

export const Wrapper = styled.header`  
  backdrop-filter: blur(1.6rem);
  max-width: 100%;
  padding: 2rem;
  position: sticky;
  top: 0;
  z-index: 1;
`

export const Content = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 120rem;
  .navigation {
    display: flex;
    align-items: center;
  }
`

export const Instagram = styled(InstagramIcon).attrs({
  size: 37,
  title: 'Instagram'
})`
  color: #c5c5c5;
  transition: color 0.5s ease-in-out;

  &:hover {
    color: #a1a1a1;
  }
`

export const GitHub = styled(GithubIcon).attrs({
  size: 29,
  title: 'GitHub'
})`
  color: #c5c5c5;
  margin-left: 1rem;
  transition: color 0.5s ease-in-out;

  &:hover {
    color: #a1a1a1;
  }
`

export const LinkedIn = styled(LinkedinIcon).attrs({
  size: 29,
  title: 'LinkedIn'
})`
  color: #c5c5c5;
  margin-left: 1rem;
  transition: color 0.5s ease-in-out;

  &:hover {
    color: #a1a1a1;
  }
`

// branco gelo
// #DDD9CE
// #ccc8bc
