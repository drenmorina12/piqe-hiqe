import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { Alert, Platform } from "react-native";
import { auth } from "../firebase/firebaseConfig";

/**
 * GitHub Authentication
 * Funksionon VETËM në Web
 */
export async function signInWithGitHub(router) {
  // ❌ Bllokojmë mobile që të mos ketë probleme
  if (Platform.OS !== "web") {
    Alert.alert(
      "GitHub Login",
      "GitHub login është i disponueshëm vetëm në Web. Ju lutem përdorni Email/Password në mobile."
    );
    return;
  }

  try {
    const provider = new GithubAuthProvider();

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("GitHub user:", user);

    alert(
      `U kyçët me sukses si ${user.displayName || user.email}`
    );

    router.replace("/");
  } catch (error) {
    console.error("GitHub login failed:", error);
    alert("GitHub login dështoi.");
  }
}
