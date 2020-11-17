import Section from '../Section'
import Header from '../Header'
import * as S from './style'

export default function Main() {
  return (
    <S.Main>
      <Header />
      <Section>
        <S.Title>Hi, I'm <br/><b>Ramon Mello</b></S.Title>
        <S.Subtitle>Software Developer</S.Subtitle>
      </Section>
      <Section>
        <S.Title>Hi, I'm <br/><b>Ramon Mello</b></S.Title>
        <S.Subtitle>Software Developer</S.Subtitle>
      </Section>
    </ S.Main>
  )
}
