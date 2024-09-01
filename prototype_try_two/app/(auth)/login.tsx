import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const navigation = useNavigation();

  // Handle the button press
  const signInWithPhoneNumber = async () => {
    try {
      // const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      // setConfirm(confirmation);
      console.log("OTP send");
    } catch (error) {
      console.log("Error sending code", error);
    }
  };
  const confirmCode = async () => {
    try {
      if (confirm) {
        // Check if confirm is not null
        const userCredential = await confirm.confirm(code);
        if (userCredential) {
          // Check if userCredential is not null
          const user = userCredential.user;
          // check if the user is new or existing
          const userDocument = await firestore()
            .collection("users")
            .doc(user.uid)
            .get();
          if (userDocument.exists) {
            // user exists, then navigate to the dashboard
            // navigation.navigate("Dashboard");
          } else {
            // user is new, navigate to modal
            // navigation.navigate("Modal", { uid: user.uid });
          }
        }
      } else {
        console.log("Confirmation object is null");
      }
    } catch (error) {
      console.log("Invalid code.");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>course90</Text>
      {!confirm ? (
        <>
          <Text style={styles.subHeadingText}>Login to continue..</Text>
          <View style={styles.insideContainer}>
            <TextInput style={styles.smallNo} placeholder="+91" aria-disabled />
            <TextInput
              style={styles.inputNumber}
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          <Text style={styles.infoText}>
            We'll send you an OTP by SMS to confirm your mobile number.
          </Text>
          <Pressable onPress={signInWithPhoneNumber} style={styles.buttonPress}>
            <Text style={styles.textInsideButton}>Send One-Time-Password </Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.afterCode}>
            Enter the code sent to your mobile
          </Text>
          <TextInput
            style={styles.inputCode}
            placeholder="Enter code"
            value={code}
            onChangeText={setCode}
          />
          <Pressable onPress={confirmCode} style={styles.buttonPress}>
            <Text style={styles.textInsideButton}>Confirm Code </Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#2e2e2e",
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    marginTop: 150,
    color: "#F7F7F7",
  },
  subHeadingText: {
    marginBottom: 20,
    fontSize: 18,
    color: "#f1e6e6",
  },
  insideContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  smallNo: {
    width: 50, // Fixed width for the country code
    marginRight: 10, // Space between the two inputs
    padding: 10, // Padding inside the TextInput
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "#ccc",
  },
  inputNumber: {
    flex: 1, // Takes up the remaining space
    padding: 10, // Padding inside the TextInput
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "#606470",
  },
  infoText: {
    fontSize: 16, // Font size of the text
    color: "#606470", // Text color
    textAlign: "left", // Center the text horizontally
    marginVertical: 10, // Space above and below the text
    paddingHorizontal: 20, // Padding on the left and right
    lineHeight: 24, // Spacing between lines of text
  },
  buttonPress: {
    backgroundColor: "#93DEFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center", // 50% of the parent container's width
  },
  textInsideButton: {
    color: "#323643",
    fontSize: 22,
    fontWeight: "bold",
  },
  afterCode: {
    marginBottom: 20,
    fontSize: 18,
  },
  inputCode: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
});
