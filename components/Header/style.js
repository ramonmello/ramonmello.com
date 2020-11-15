import { InstagramAlt as InstagramIcon } from '@styled-icons/boxicons-logos/InstagramAlt'
import { Github as GithubIcon, Linkedin as LinkedinIcon } from '@styled-icons/fa-brands'
import styled from 'styled-components'

export const Wrapper = styled.header`
  background-color:rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  max-width: 100%;
  position: sticky;
  top: 0;
  z-index: 1;
`

export const Content = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 98rem;
  padding: 2rem;
`

export const Instagram = styled(InstagramIcon).attrs({
  size: 36,
  title: 'Instagram'
})`
  color: #d2d2d2;
`

export const GitHub = styled(GithubIcon).attrs({
  size: 29,
  title: 'GitHub'
})`
color: #d2d2d2;
`

export const LinkedIn = styled(LinkedinIcon).attrs({
  size: 29,
  title: 'LinkedIn'
})`
color: #d2d2d2;
`
