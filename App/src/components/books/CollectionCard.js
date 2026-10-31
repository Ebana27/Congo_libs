import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, typography } from '../../constants/themes';

export default function CollectionCard({ title, Icon, bg = colors.primaryDark, width = 120, height = 170 }) {
  return (
    <View style={[styles.cover, { width, height, backgroundColor: bg }]}>
      <Icon size={30} color="rgba(255,255,255,0.85)" strokeWidth={1.6} />
      <Text numberOfLines={3} style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
    marginRight: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  title: {
    ...typography.caption,
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.surface,
  },
});