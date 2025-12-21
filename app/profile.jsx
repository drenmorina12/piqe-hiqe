import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

import { Entypo, MaterialIcons } from '@expo/vector-icons';

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // sigurohu që db është i eksportuar


import Header from '../components/layout/Header';
import AnimatedButton from '../components/ui/AnimatedButton';
import Button from '../components/ui/Button';
import { auth } from '../firebase/firebaseConfig';
import { fetchSubjects } from '../firebase/subjectService';




const DEFAULT_AVATAR =
  'https://i.pinimg.com/1200x/51/c3/59/51c359defeb3cbae892c5cdada9ab747.jpg';

export default function ProfileScreen() {
  const [subjectsCount, setSubjectsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
const [statusModalVisible, setStatusModalVisible] = useState(false);
const [statusType, setStatusType] = useState(""); // "success" ose "error"
const [statusMessage, setStatusMessage] = useState("");

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
    const loadAvatar = async () => {
      const savedAvatar =
        await AsyncStorage.getItem('profileAvatar');

      if (savedAvatar) {
        setProfileImage(savedAvatar);
      }
    };

    loadAvatar();
  }, []);

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
    if (!authReady) return;

    const loadSubjects = async () => {
      try {
        const data = await fetchSubjects();
        setSubjectsCount(data.length);
      } catch (err) {
        console.log('Error fetching subjects in profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, [authReady]);

  const displayName =
    user?.displayName || (user?.email ? user.email.split('@')[0] : 'User');

    const handleRemoveImage = async () => {
  try {
    setProfileImage(DEFAULT_AVATAR); // ndryshon UI

    // heq ose pastron fushën image në Firestore
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { image: '' });

    setShowEditModal(false); // mbyll modalin
  } catch (err) {
    console.log('Error removing image:', err);
  }
};
  const handleToggleEditModal = () => {
    setShowEditModal(prev => !prev);
  };
  const handlePickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Duhet leje për të zgjedhur foto');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;
    
    // Ruajmë në Firestore
    const userRef = doc(db, "users", user.uid); // sigurohu që user ka uid
    try {
      await updateDoc(userRef, { image: base64Img });
      setProfileImage(base64Img); // për UI
      showStatusModal("success", "Fotoja u ruajt me sukses!");
    } catch (err) {
      console.log(err);
      showStatusModal("error", "Fotoja nuk u ruajt, provoni përsëri.");
    }
  
    }
    setShowEditModal(false); // mbyll modal pas zgjedhjes
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
  });

  if (!result.canceled) {
    const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;
    
    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, { image: base64Img });
      setProfileImage(base64Img);
      showStatusModal("success", "Foto u ruajt me sukses!");
    } catch (err) {
      console.log(err);
      showStatusModal("error", "Foto nuk u ruajt, provoni përsëri.");
    }
  }
    setShowEditModal(false); // mbyll modal pas heqjes
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
    router.push('/change-password'); // emri i route-it të ri
  };

  if (!authReady) {
    return (
      <View style={styles.safeArea}>
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
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <Header
        backgroundColor="#e4ca47ff"
        title="Profili"
        icon="person-circle-outline"
        showHome
        showBack={true}
        onBackPress={() => router.back()}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <View style={styles.container}>
         <View style={styles.avatarContainer}>
  <Image
    source={{ uri: profileImage || DEFAULT_AVATAR }}
    style={styles.avatar}
  />
  <AnimatedButton
    title="Edit"
    onPress={handleToggleEditModal}
    style={styles.editButton}
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
    style={styles.modalOverlay}
    activeOpacity={1}
    onPressOut={handleToggleEditModal}
  >
    <View style={styles.modalContent}>
      <TouchableOpacity onPress={handleTakePhoto} style={styles.modalButton}>
        <Entypo name="camera" size={24} color="#ffffffff" />
        <Text style={styles.modalButtonText}>Bëj foton</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalButton} onPress={handlePickImage}>
        <MaterialIcons name="photo-library" size={24} color="#ffffffff" />
        <Text style={styles.modalButtonText}>Ndrysho foton</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalButton} onPress={handleRemoveImage}>
        <Text style={[styles.modalButtonText, { color: '#d11b1bff' }]}>
          Largo foton
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setShowEditModal(false)}
        style={[styles.editButton, { justifyContent: 'center', marginTop: 10 }]}
      >
        <Text style={[styles.editButtonText, { color: '#4e4545ff',padding:'7',fontSize:'15', }]}>Mbyll</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
</Modal>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Emri:</Text>
          <Text style={styles.infoValue}>{displayName}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{email}</Text>
        </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Lëndët e regjistruara:</Text>
            {loading ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text style={styles.infoValue}>{subjectsCount}</Text>
            )}
          </View>
          <View style={styles.logoutContainer}>
            <Button
              style={{
                backgroundColor: '#e7d919ff',
                borderRadius: 30,
                paddingVertical: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
                width: '90%',
              }}
              title="Ndrysho fjalëkalimin"
              onPress={handleChangePassword}
            />

            <Button
              style={{
                backgroundColor: '#ec6f21ff',
                borderRadius: 30,
                paddingVertical: 12,
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
              }}
              title="Dil (Logout)"
              onPress={handleLogout}
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
      flex:1,
      backgroundColor:'rgba(0,0,0,0.5)',
      justifyContent:'center',
      alignItems:'center'
    }}
    activeOpacity={1}
    onPressOut={handleCloseStatusModal}
  >
    <View style={{
      backgroundColor:'#fff',
      padding:20,
      borderRadius:10,
      minWidth:250,
      alignItems:'center'
    }}>
      <Text style={{color: statusType === "success" ? "green":"red", fontWeight:"bold", marginBottom:10}}>
        {statusType === "success" ? "✔" : "✖"}
      </Text>
      <Text style={{textAlign:'center'}}>{statusMessage}</Text>
      <TouchableOpacity onPress={handleCloseStatusModal} style={{marginTop:15}}>
        <Text style={{color:'#3f9f95ff'}}>Mbyll</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
</Modal>

        {/* <View style={styles.logoutContainer}>
          <Button
            style={{
              backgroundColor: '#075eec',
              borderRadius: 30,
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Dil (Logout)"
            onPress={handleLogout}
          />
        </View> */}
        </View>
      </SafeAreaView>
    </View>);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
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
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#000000fd',
    elevation: 1,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  logoutContainer: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60, // e bën rrethore
    backgroundColor: '#ddd',
  },
  changePhotoText: {
    marginTop: 8,
    color: '#cea138ff',
    fontWeight: '600',
    textAlign: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#383333ff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalButton: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'left',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffffff',
    textAlign: 'center',
    marginLeft: 12,
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
