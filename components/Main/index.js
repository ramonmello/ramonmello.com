import Image from 'next/image'
import Section from '../Section'
import Header from '../Header'
import * as S from './style'

export default function Main() {
  return (
    <S.Main>
      <Header />
      <Section styles="justify-content: center;">
        <S.Title>Hi, I'm <br/><b className='name'>Ramon Mello</b></S.Title>
        <S.Subtitle>Software Developer</S.Subtitle>
      </Section>
      <Section>
        <S.SctionTitle>DrChat</S.SctionTitle>
        <Image src="/projects/drchat.png"  width={1345} height={725} alt="DrChat" />
      </Section>
      {/* <Section>
        <S.SctionTitle>Medicinia</S.SctionTitle>
        <Image src="/projects/medicinia2.png" width={1393} height={963} alt="Medicinia" />
      </Section>
      <Section>
        <S.SctionTitle>Àmostra</S.SctionTitle>
        <Image src="/projects/amostra.png" width={1218} height={675} alt="Medicinia" />
      </Section>
      <Section>
        <S.SctionTitle>Delage</S.SctionTitle>
        <Image src="/projects/rxmove.png" width={1216} height={877} alt="Medicinia" />
      </Section> */}
    </ S.Main>
  )
}
