import Section from '../Section'
import Header from '../Header'
import * as S from './style'

export default function Main() {
  return (
    <S.Main>
      <Header />
      <Section>
        <S.Title>Hi, I'm <br/><b className='name'>Ramon Mello</b></S.Title>
        <S.Subtitle>Software Developer</S.Subtitle>
      </Section>
      <Section>
        <S.SctionTitle>Abaut me</S.SctionTitle>
        <S.TextParagraph>Olá, meu nome é ramon, sou brasileiro e tenho 28 anos, apesar de tender mais 
          para as ciências exatas, gosto bastante de fotografia e design, acho que é porque
          essas áreas conversão bem com a minha verdadeira paixão, que é criar soluções que
          façam a vida das pessoas melhores.
        </S.TextParagraph>
      </Section>
    </ S.Main>
  )
}
