import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../../src/constants/themes';
import { ChevronRight } from 'lucide-react-native';

export default function DiscoveryCard({ title, Description, Icon, bg }) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.container}>
        <View style={[styles.square, { backgroundColor: bg }]}>
          {Icon}
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{Description}</Text>
        </View>
      </View>

      <View style={styles.chevronContainer}>
        <ChevronRight color={colors.textSecondary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 300,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    gap: 20,
    marginTop: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 15,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 18,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  square: {
    padding: 20,
    borderRadius: 12,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronContainer: {
    width: 20,
  },
});
