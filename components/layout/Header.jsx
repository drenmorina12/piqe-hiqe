import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Header({
  backgroundColor = '#ffae00ff',
  showBack = false,
  showHome = false,
  onBackPress,
  icon,
  iconColor = 'white',
  title,
  subtitle,
  rightButton,
}) {
  const handleBack = () => {
    if (onBackPress) onBackPress();
    else router.back();
  };

  return (
    <View style={[styles.header, { backgroundColor }]}>
      <SafeAreaView edges={['top']}>

        {/* TOP ROW */}
        <View style={styles.topRow}>
          {showBack ? (
            <Pressable onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={22} color="white" />
              <Text style={styles.backText}>Kthehu</Text>
            </Pressable>
          ) : (
            <View style={{ width: 60 }} />
          )}

          <View style={styles.rightButtonWrapper}>
            {showHome && (
            <Pressable onPress={() => router.replace('/')}>
            <Ionicons name="home-outline" size={28} color="white" />
            </Pressable>
         )}

  {rightButton}
</View>

        </View>

        {/* MAIN CONTENT: Icon + Title + Subtitle */}
        <View style={styles.contentRow}>
          {icon && (
            <View style={styles.iconContainer}>
              <Ionicons name={icon} size={32} color={iconColor} />
            </View>
          )}

          <View style={{ flex: 1 }}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  /* Top Row */
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    color: 'white',
    fontSize: 16,
  },
  rightButtonWrapper: {
  flexDirection: "row",
  alignItems: "center",
  gap: 16, 
  },

  /* Main Content */
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
  },
});
