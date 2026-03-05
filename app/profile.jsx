import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

import { router } from 'expo-router';

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

import Header from '../components/layout/Header';
import AnimatedButton from '../components/ui/AnimatedButton';
import { auth } from '../firebase/firebaseConfig';
import { fetchSubjects } from '../firebase/subjectService';

import { useTheme } from '../context/ThemeContext';

// 🔔 NOTIFICATIONS
import {
  cancelDailyReminder,
  ensurePermissions,
  scheduleDailyReminder,
} from '../utils/notifications';

import {
  getUserNotificationsEnabled,
  setUserNotificationsEnabled,
} from '../firebase/notificationSettings';

const DEFAULT_AVATAR = 'https://i.pinimg.com/1200x/51/c3/59/51c359defeb3cbae892c5cdada9ab747.jpg';


export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();

  const [subjectsCount, setSubjectsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusType, setStatusType] = useState(''); // "success" ose "error"
  const [statusMessage, setStatusMessage] = useState('');

  // 🔔 NOTIFICATIONS STATE
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const showStatusModal = (type, message) => {
    setStatusType(type);
    setStatusMessage(message);
    setStatusModalVisible(true);
  };

  const handleCloseStatusModal = () => {
    setStatusModalVisible(false);
  };

  const [user, setUser] = useState(auth.currentUser ?? null);


  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.replace('/login');
      } else {
        setUser(firebaseUser);
        setAuthReady(true);
      }
    });

    return unsub;
  }, []);

  useEffect(() => {
    if (!authReady || !user) return;

    const loadAvatar = async () => {
      try {
        const savedAvatar = await AsyncStorage.getItem('profileAvatar');
        if (savedAvatar) {
          setProfileImage(savedAvatar);
        }

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.image && data.image !== savedAvatar) {
            setProfileImage(data.image);
            await AsyncStorage.setItem('profileAvatar', data.image);
          }
        } else {
          setProfileImage(DEFAULT_AVATAR);
        }
      } catch (err) {
        console.log("Error loading avatar:", err);
        setProfileImage(DEFAULT_AVATAR);
      }
    };

    loadAvatar();
  }, [authReady, user]);

  // ===============================
  // LOAD DATA + NOTIFICATIONS STATE
  // ===============================
  useEffect(() => {
    if (!authReady || !user) return;

    const loadData = async () => {
      try {
        const data = await fetchSubjects();
        setSubjectsCount(data.length);

        const enabled = await getUserNotificationsEnabled(user.uid);
        setNotificationsEnabled(enabled);
      } catch (err) {
        console.log('Error fetching subjects in profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authReady, user?.uid]);

  const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'User');

  const handleRemoveImage = async () => {
    try {
      setProfileImage(DEFAULT_AVATAR);



     const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { image: '' });

      await AsyncStorage.removeItem('profileAvatar');
    } catch (err) {
      console.log('Error removing image:', err);
      showStatusModal("error", "Fotoja nuk u fshi, provoni përsëri.");
    }
    setShowEditModal(false);
  };

  const handleToggleEditModal = () => {
    setShowEditModal((prev) => !prev);
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Duhet leje për të zgjedhur foto');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;

      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { image: base64Img });
        await AsyncStorage.setItem('profileAvatar', base64Img);
        setProfileImage(base64Img);
        showStatusModal("success", "Fotoja u ruajt me sukses!");
      } catch (err) {
        console.log(err);
        showStatusModal("error", "Fotoja nuk u ruajt, provoni përsëri.");
      }
    }
    setShowEditModal(false);
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert('Duhet leje për të përdorur kamerën');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
      quality: 0.8,
      mediaTypes: ["images"]
    });

    if (!result.canceled) {
      const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;

      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { image: base64Img });
        await AsyncStorage.setItem('profileAvatar', base64Img);
        setProfileImage(base64Img);
        showStatusModal("success", "Foto u ruajt me sukses!");
      } catch (err) {
        console.log(err);
        showStatusModal("error", "Foto nuk u ruajt, provoni përsëri.");
      }
    }
    setShowEditModal(false);
  };

  // ===============================
  // 🔔 TOGGLE NOTIFICATIONS
  // ===============================
  const handleToggleNotifications = async (value) => {
    setNotificationsEnabled(value);
    await setUserNotificationsEnabled(user.uid, value);

    if (value) {
      const granted = await ensurePermissions();
      if (!granted) {
        Alert.alert('Njoftimet', 'Lejet për njoftime nuk u dhanë.');
        setNotificationsEnabled(false);
        await setUserNotificationsEnabled(user.uid, false);
        return;
      }

      await scheduleDailyReminder(20, 0);

      Alert.alert(
        'Njoftimet u aktivizuan',
        'Do të merrni një rikujtues ditor nëse nuk e përdorni aplikacionin.'
      );
    } else {
      await cancelDailyReminder();
      Alert.alert(
        'Njoftimet u çaktivizuan',
        'Nuk do të merrni më njoftime.'
      );
    }
  };


  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (err) {
      console.log('Error during logout:', err);
    }
  };

  const email = user?.email || 'Nuk ka email';

  const handleChangePassword = () => {
    router.push('/change-password');
  };

  if (!authReady) {
    return (
      <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <Header
          backgroundColor="#e4ca47ff"
          title="Profili"
          subtitle="Duke i ngarkuar të dhënat..."
          icon="person-circle-outline"
          showHome
          showBack={true}
          onBackPress={() => router.back()}
        />

        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary ?? colors.tint} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Header
        backgroundColor="#e4ca47ff"
        title="Profili"
        icon="person-circle-outline"
        showHome
        showBack={true}
        onBackPress={() => router.back()}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: profileImage || DEFAULT_AVATAR }}
              style={styles.avatar}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={200}
            />
            <AnimatedButton
              title="Edit"
              onPress={handleToggleEditModal}
              style={[
                styles.editButton,
                { backgroundColor: colors.card ?? colors.background }
              ]}
              textStyle={styles.editButtonText}
            />
          </View>

          <Modal
            visible={showEditModal}
            animationType="slide"
            transparent
            onRequestClose={handleToggleEditModal}
          >
            <TouchableOpacity
              style={[styles.modalOverlay, { backgroundColor: colors.overlay ?? 'rgba(0,0,0,0.5)' }]}
              activeOpacity={1}
              onPressOut={handleToggleEditModal}
            >
              <View style={[styles.modalContent, { backgroundColor: colors.card ?? colors.background }]}>
                <AnimatedButton
                  title="Bëj foton"
                  onPress={handleTakePhoto}
                  style={styles.modalActionButton}
                />

                <AnimatedButton
                  title="Ndrysho foton"
                  onPress={handlePickImage}
                  style={styles.modalActionButton}
                />

                <AnimatedButton
                  title="Largo foton"
                  variant="danger"
                  onPress={handleRemoveImage}
                  style={styles.modalActionButton}
                />

                <AnimatedButton
                  title="Mbyll"
                  variant="secondary"
                  onPress={() => setShowEditModal(false)}
                  style={styles.modalActionButton}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          <View style={[styles.infoBox, { backgroundColor: colors.card ?? colors.background }]}>
            <Text style={[styles.infoLabel, { color: colors.mutedText ?? '#6B7280' }]}>Emri:</Text>
            <Text style={[styles.infoValue, { color: colors.text ?? '#111827' }]}>{displayName}</Text>
          </View>

          <View style={[styles.infoBox, { backgroundColor: colors.card ?? colors.background }]}>
            <Text style={[styles.infoLabel, { color: colors.mutedText ?? '#6B7280' }]}>Email:</Text>
            <Text style={[styles.infoValue, { color: colors.text ?? '#111827' }]}>{email}</Text>
          </View>

          <View style={[styles.infoBox, { backgroundColor: colors.card ?? colors.background }]}>
            <Text style={[styles.infoLabel, { color: colors.mutedText ?? '#6B7280' }]}>Lëndët e regjistruara:</Text>
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary ?? colors.tint} />
            ) : (
              <Text style={[styles.infoValue, { color: colors.text ?? '#111827' }]}>{subjectsCount}</Text>
            )}
          </View>

          {/* ✅ DARK/LIGHT SWITCH (i ri) */}
          <View style={[styles.infoBox, { backgroundColor: colors.card ?? colors.background }]}>
            <Text style={[styles.infoLabel, { color: colors.mutedText ?? '#6B7280' }]}>
              Dark Mode
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border ?? '#ccc', true: colors.primary ?? colors.tint ?? '#4F46E5' }}
              thumbColor={Platform?.OS === 'android' ? (isDark ? (colors.onPrimary ?? '#fff') : '#fff') : undefined}
              ios_backgroundColor={colors.border ?? '#ccc'}
            />
          </View>

          {/* 🔔 NOTIFICATIONS */}
          <View style={[styles.infoBox, { backgroundColor: colors.card ?? colors.background }]}>
            <Text style={[styles.infoLabel, { color: colors.mutedText ?? '#6B7280' }]}>Daily Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.border ?? '#ccc', true: colors.primary ?? colors.tint ?? '#4F46E5' }}
              ios_backgroundColor={colors.border ?? '#ccc'}
            />
          </View>

          <View style={styles.buttonContainer}>
              <AnimatedButton
                title="Ndrysho fjalëkalimin"
                onPress={handleChangePassword}
                style={[styles.changePasswordButton, { backgroundColor: '#e7d919ff' }]}
                textStyle={{ color: '#fff' }}
              />

              <AnimatedButton
                title="Dil (Logout)"
                onPress={handleLogout}
                style={[styles.logoutButton, { backgroundColor: '#ec6f21ff' }]}
                textStyle={{ color: '#fff' }}
              />
          </View>

          <Modal
            visible={statusModalVisible}
            transparent
            animationType="fade"
            onRequestClose={handleCloseStatusModal}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: colors.overlay ?? 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={1}
              onPressOut={handleCloseStatusModal}
            >
              <View
                style={{
                  backgroundColor: colors.card ?? colors.background ?? '#fff',
                  padding: 20,
                  borderRadius: 10,
                  minWidth: 250,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: statusType === 'success' ? 'green' : 'red',
                    fontWeight: 'bold',
                    marginBottom: 10,
                  }}
                >
                  {statusType === 'success' ? '✔' : '✖'}
                </Text>
                <Text style={{ textAlign: 'center', color: colors.text ?? '#111827' }}>
                  {statusMessage}
                </Text>
                <TouchableOpacity onPress={handleCloseStatusModal} style={{ marginTop: 15 }}>
                  <Text style={{ color: colors.primary ?? colors.tint ?? '#3f9f95ff' }}>Mbyll</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    width: '95%',
  },
  infoLabel: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 30,
    gap: 12,
    width: '80%',
    alignItems: 'center',
  },
  changePasswordButton: {
    marginBottom: 0,
    alignSelf: 'stretch',
    marginHorizontal: 5,
  },
  logoutButton: {
    marginBottom: 0,
    alignSelf: 'stretch',
    marginHorizontal: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 12,
  },
  modalActionButton: {
    marginTop: 0,
  },
  editButton: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#776539ff',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 13,
    color: '#b08f43ff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
