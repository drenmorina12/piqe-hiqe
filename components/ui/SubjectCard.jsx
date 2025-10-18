import { Image, StyleSheet, Text, View } from 'react-native';

const SubjectCard = ({ icon, subjectName, iconBackgroundColor, collectionCount }) => {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrapper, { backgroundColor: iconBackgroundColor }]}>
        <Image source={icon} style={styles.icon} resizeMode="cover" />
      </View>
      <Text style={styles.subjectText}>{subjectName}</Text>
      {collectionCount !== undefined && (
        <Text style={styles.collectionText}>
          {collectionCount} {collectionCount === 1 ? 'collection' : 'collections'}
        </Text>
      )}
    </View>
  );
};

export default SubjectCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 13,
    width: 160,
    height: 150,
    alignItems: 'flex-start',
    elevation: 4,
    shadowColor: '#071638ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    margin: 7,
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 15,
    marginBottom: 5,
  },
  icon: {
    width: 60,
    height: 60,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000ff',
  },
  collectionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});