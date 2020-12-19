import Image from 'next/image'
import Header from '../Header'
import * as S from './style'

export default function Main() {
  return (
    <S.Main>
      <Header />
      <S.WelcomeSection styles="justify-content: center;">
        <S.Title>Hi, I'm <br/><span className='name'>Ramon Mello</span></S.Title>
        <S.Subtitle>Software Developer</S.Subtitle>
      </S.WelcomeSection>
      <S.ProductSection>
        <S.SectionTitle>DrChat</S.SectionTitle>        
        <Image src="/projects/drchat.png" quality={100} width={1024} height={557}  alt="DrChat" />        
      </S.ProductSection>
      <S.ProductSection>
        <S.SectionTitle>Medicinia</S.SectionTitle>
        <Image src="/projects/medicinia.png" quality={100} width={1082} height={633}  alt="DrChat" />
      </S.ProductSection>
    </ S.Main>
  )
}
