import * as S from './style'

const Section = ({children, ...rest}) => {
  return (
    <S.Wrapper {...rest}>
      <S.Section>
      {children}
      </S.Section>
    </S.Wrapper>
  )
}

export default Section