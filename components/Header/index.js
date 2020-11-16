import Image from 'next/image'
import * as S from './style'

export default function Header() {
  return (
    <S.Wrapper>
      <S.Content>
        <Image src="/logo3.png" width="49" height="63" alt="Logotipo Ramon" />
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
