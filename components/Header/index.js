import Image from 'next/image'
import * as S from './style'

export default function Header() {
  return (
    <S.Wrapper>
      <S.Content>
        <Image src="/Logo.svg" width="150" height="36" alt="Logotipo Ramon" />
        <div className="navigation">
          <a href="https://www.instagram.com/codingwithramon/" target="_black">
            <S.Instagram />
          </a>
          <a href="https://www.instagram.com/codingwithramon/" target="_black">
            <S.GitHub />
          </a>
          <a href="https://www.instagram.com/codingwithramon/" target="_black">
            <S.LinkedIn />
          </a>
        </div>
      </S.Content>
    </S.Wrapper>
  )
}
