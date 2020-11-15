import * as S from './style'

const Section = ({children}) => {
  return (
    <S.Wrapper>
      <S.Section>
      {children}
      </S.Section>
    </S.Wrapper>
  )
}

export default Section