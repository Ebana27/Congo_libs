export const colors = {
  primary: '#84CC16',
  primaryDark: '#4D7C0F',
  primaryLight: '#A3E635',
  background: '#ECFCCB',
  surface: '#FFFFFF',
  text: '#1A2E05',
  textSecondary: '#5B6B3C',
  border: '#BEF264',
  danger: '#DC2626',
};

export const fonts = {
  poppins: 'Poppins',
  inter: 'Inter',
};

export const typography = {
  title: { fontFamily: fonts.poppins, fontSize: 24, fontWeight: '700', lineHeight: 32, color: colors.text },
  subtitle: { fontFamily: fonts.poppins, fontSize: 18, fontWeight: '600', lineHeight: 26, color: colors.text },
  body: { fontFamily: fonts.inter, fontSize: 16, lineHeight: 24, color: colors.text },
  caption: { fontFamily: fonts.inter, fontSize: 13, lineHeight: 18, color: colors.textSecondary },
  button: { fontFamily: fonts.inter, fontSize: 16, fontWeight: '600', color: colors.surface },
};