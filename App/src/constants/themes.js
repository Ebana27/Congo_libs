export const colors = {
  primary: '#7cf3bc',
  primaryDark: '#088a49',
  primaryLight: '#edf8f1',
  background: '#edf8f1',
  surface: '#FFFFFF',
  text: '#060a0d',
  textSecondary: '#074a2b',
  border: '#d5cdcd',
  danger: '#ff5f3a',
  arc: {
    add: '#0b0d54',
    feedback: '#1dd572',
    share: '#5999e6',
  },
};

export const fonts = {
  poppinsRegular: 'Poppins-Regular',
  poppinsMedium: 'Poppins-Medium',
  poppinsSemiBold: 'Poppins-SemiBold',
  poppinsBold: 'Poppins-Bold',
  inter: 'Inter',
};

export const typography = {
  title: { fontFamily: fonts.poppinsBold, fontSize: 24, lineHeight: 38, color: colors.text, includeFontPadding: false },
  subtitle: { fontFamily: fonts.poppinsSemiBold, fontSize: 18, lineHeight: 28, color: colors.text, includeFontPadding: false },
  body: { fontFamily: fonts.inter, fontSize: 16, lineHeight: 24, color: colors.text, includeFontPadding: false },
  caption: { fontFamily: fonts.inter, fontSize: 13, lineHeight: 20, color: colors.textSecondary, includeFontPadding: false },
  button: { fontFamily: fonts.inter, fontSize: 16, fontWeight: '600', color: colors.surface, includeFontPadding: false },
};