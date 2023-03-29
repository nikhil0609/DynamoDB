import {
  SafeAreaView,
  Image,
  ImageBackground,
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Icon, VStack } from "native-base";
import React, { useState, useContext } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation, useRoute } from "@react-navigation/core";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { userPool } from "../services/userPool";
import { Asset } from "expo-asset";
import { Ionicons } from "@expo/vector-icons";
import { addUser } from "../services/DB_Framework";
import { IUserParams, EResultType } from "../services/DB_Framework/dist/interfaces";

const SignupScreen = () => {
  const navigation = useNavigation();
  React.useState("placeholder text");
  const route = useRoute();
  const fName = route.params.fName;
  const lName = route.params.lName;
  const gender = route.params.gender;
  const dob = route.params.dob;
  const weight = route.params.weight;
  const feet = route.params.height;
  const inch = route.params.inch;

  const [email, onChangeEmail] = React.useState(null);
  const [passwd, onChangePwd] = React.useState(null);
  const [cpasswd, onConfirmePwd] = React.useState(null);
  const [errorFlag, passwdErrorMessage] = React.useState(null);
  const [cerrorFlag, confirmPasswordErrorMessage] = React.useState(null);

  // const { authenticate } = useContext(AccountContext);
  const onSubmit = (event) => {
    // console.log(dob + "---------------->onSubmit");
    let errorFlag = false;
    if (email == null) {
      Alert.alert("Email is required feild.");
    } else if (passwd == null || cpasswd == null) {
      Alert.alert("Password is required feild.");
    } else if (passwd !== cpasswd) {
      Alert.alert("Password and confirm password should be same.");
    } else if (passwd.length < 6 || cpasswd.length < 6) {
      Alert.alert("Password should be atleast 6 characters.");
    } else {
      // ---User signup flow start

      userPool.signUp(email, passwd, [], null, (err, data) => {
        try {
          if (err) {
            //Fix me: Why we are showing the API error to the user!
            Alert.alert(err);
          }
          console.log("Signed up successfully!", data["userSub"]);

          // How to call this function->
          // FIXME(DB_FrameWork): Create an interface from this object and added to the
          // DB_Framework module.
          const userParams : IUserParams = {
            email: email,
            first_name: fName,
            last_name: lName,
            dob: dob.toString(),
            gender: gender,
            weight: weight,
            height: {
              feet: feet,
              inch: inch,
            }
          };
          addUser(data["userSub"], userParams, (status)=>{
            if(status.result_type==EResultType.Success){
              Alert.alert("A verification link has been sent to your email. Please verify your email and Sign in");
            }else{
              //Fix me: 
              Alert.alert("There is a system error. Please try again later.");
            }
          });
          navigation.replace("Signin");
        } catch (error) {
          console.log(err, error);
          Alert.alert("Error: User already exists!!");
        }
      });
    }
    // ----User signup flow end

    // event.preventDefault();
    // authenticate(email, passwd)
    //   .then((data) => {
    //     console.log("Logged in!", data);
    //   })
    //   .catch((err) => {
    //     console.error("Failed to login", err);
    //   });

    // ----User signin flow start
    //   const user = new CognitoUser({
    //     Username: email,
    //     Pool: userPool,
    //   });

    //   const authDetails = new AuthenticationDetails({
    //     Username: email,
    //     Password: passwd,
    //   });

    //   user.authenticateUser(authDetails, {
    //     onSuccess: (data) => {
    //       console.log("onSuccess:", data);
    //       navigation.replace("Form1");
    //     },
    //     onFailure: (err) => {
    //       console.error("onFailure:", err);
    //     },
    //     newPasswordRequired: (data) => {
    //       console.log("newPasswordRequired:", data);
    //     },
    //   });
    // ----User signin flow end
  };

  return (
    <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require("../../assets/images/profile_banner.png")}
          resizeMode='stretch'
          style={styles.banner}>
          <VStack space='3'>
            <Icon style={styles.btn} as={Ionicons} name='chevron-back-outline' size={10} onPress={navigation.goBack} />
          </VStack>
        </ImageBackground>
        <View style={styles.signupContainer}>
          <Text style={styles.signUpText}>Create Account</Text>
          <Text style={styles.descText}>You will receive a verification link</Text>
         </View>
      <KeyboardAwareScrollView>
        <View>
          <Text style={styles.inputText}>Email Address</Text>
          <TextInput
            style={styles.textContainer}
            onChangeText={onChangeEmail}
            value={email}
            placeholder='Hello@domain.com'
            placeholderTextColor='#A3A3A3'
            keyboardType='default'
          />
          <Text style={styles.inputText}>Password</Text>
          <TextInput
            style={styles.textContainer}
            secureTextEntry={true}
            onChangeText={onChangePwd}
            value={passwd}
            placeholder='Password At-least 6 digits'
            placeholderTextColor='#A3A3A3'
            keyboardType='default'
          />
          {/* {passwdErrorMessage.length > 0 && <Text style={styles.textDanger}>{passwdErrorMessage}</Text>} */}
          <Text style={styles.inputText}>Password Confirmation</Text>
          <TextInput
            style={styles.textContainer}
            secureTextEntry={true}
            onChangeText={onConfirmePwd}
            value={cpasswd}
            placeholder='Password Confirmation'
            placeholderTextColor='#A3A3A3'
            keyboardType='default'
          />
          {/* {confirmPasswordErrorMessage.length > 0 && <Text style={styles.textDanger}>{confirmPasswordErrorMessage}</Text>} */}
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          disabled={!email || !passwd || !cpasswd}
          onPress={() => {
            // navigation.replace("Completion");
            onSubmit();
          }}
          //   onPress={onSubmit}
          style={!email || !passwd || !cpasswd ? styles.disabled : styles.button}>
          <Text style={styles.buttonText}>Send Verification Link</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    height:"100%",
    top: -48,
  },
  btn: {
    marginRight: "4%",
    marginTop: "6%",
  },
  signupContainer: {
    width: "100%",
    marginTop: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  textDanger: {
    color: "#FF0000",
    fontWeight: "400",
    fontSize: 16,
  },
  signUpText: {
    color: "#27272A",
    fontWeight: "700",
    fontSize: 36,
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  textContainer: {
    marginBottom: 32,
    marginRight: 40,
    marginLeft: 40,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#E5E5E5",
    padding: 10,
    fontSize: 20,
    fontWeight: "400",
  },
  descText: {
    color: "#737373",
    fontWeight: "400",
    fontSize: 24,
    width: "60%",
    padding: 10,
    marginBottom: 10,
    lineHeight: 30,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  buttonContainer: {
    marginBottom: 0,
  },
  button: {
    backgroundColor: "#67E8F9",
    width: "90%",
    height: 65,
    padding: 10,
    marginLeft: 20,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    backgroundColor: "#D3D3D3",
    width: "90%",
    height: 65,
    padding: 10,
    marginLeft: 20,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#27272A",
    fontWeight: "500",
    fontSize: 24,
    fontStyle: "normal",
  },
  banner: {
    justifyContent: "center",
    top:0,
    width: "100%",
    height: 120,
    alignSelf: "center",
  },
  inputText: {
    color: "black",
    fontWeight: "700",
    marginLeft: 40,
    marginBottom: 5,
    fontSize: 24,
    width: "60%",
  },
});
