import {
  SafeAreaView,
  ImageBackground,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Icon, VStack } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

import React, { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { userPool } from "../services/userPool";
import { Asset } from "expo-asset";
import { Ionicons } from "@expo/vector-icons";
import * as AWS from "aws-sdk";

import { loggedinUser } from "../constants/states";

import { getUserDetails } from "../services/DB_Framework";
import { EResultType } from "../services/DB_Framework/dist/interfaces";

//const  new AWS.DynamoDB.DocumentClient();

export default function OnboardingSignin() {
  const navigation = useNavigation();

  const [email, onChangeEmail] = useState(null);
  const [passwd, onChangePwd] = useState(null);

  const onSubmit = (event) => {
    if (passwd == null || email == null) {
      Alert.alert("Email and Password are required.");
    } else {

      // ----User signin flow start
      const user = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: passwd,
      });

      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          const userID = data.accessToken.payload.username;
          loggedinUser.loggedinUser_id = userID;
          console.log("Logged in successfully:", data);

          const email = data.idToken.payload.email;

          // How to call this function->
          // const user_id = "8721f790-d3f1-4b27-8a3a-71c049abca3f";
          (async () => {
            let user = await getUserDetails(userID);

            if(user.result_type==EResultType.Success){
              loggedinUser.loggedinUser_data = user.data[0];

              loggedinUser.loggedinUser_data.email = email;
              console.log("DynamoDb", user);
              navigation.navigate("Completion");
            }else{
              console.error(user.error);
              //Fixme: What we should do here.
              //navigation.navigate("");
            }
          })();

          const storeData = async (userID) => {
            try {
              await AsyncStorage.setItem("userID", userID);
            } catch (e) {
              // saving error
            }
          };
          storeData(userID);
        },
        onFailure: (err) => {
          // console.error("onFailure:", err);
          Alert.alert("Incorrect Username or Password");
          console.error("Wrong password:", err)
        },
        newPasswordRequired: (data) => {
          console.log("newPasswordRequired:", data);
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.signupContainer}>
        <ImageBackground
          source={require("../../assets/images/profile_banner.png")}
          resizeMode='stretch'
          style={styles.banner}>
          <VStack space='3'>
            <Icon style={styles.btn} as={Ionicons} name='chevron-back-outline' size={10} onPress={navigation.goBack} />
          </VStack>
        </ImageBackground>
        <Text style={styles.signUpText}>Log In</Text>
        <Text style={styles.descText}>Enter your email and password</Text>
      </View>
      <View>
        <Text style={styles.inputText}>Email Address</Text>
        <TextInput
          style={styles.textContainer}
          autoFocus={true}
          // onChangeText={(event) => { event && onChangeEmail.focus() }}
          onChangeText={onChangeEmail}
          value={email}
          placeholder='Hello@domain.com'
          placeholderTextColor='#A3A3A3'
          keyboardType='default'
        />
        <Text style={styles.inputText}>Password</Text>
        <TextInput
          style={styles.textContainer}
          // inputRef={(r) => { onChangeEmail = r }}
          // onChangeText={(event) => { event && onChangePwd.focus() }}
          onChangeText={onChangePwd}
          secureTextEntry={true}
          value={passwd}
          placeholder=' Password'
          placeholderTextColor='#A3A3A3'
          keyboardType='default'
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            // navigation.replace("Form1");
            onSubmit();
          }}
          // onPress={onSubmit}
          style={styles.button}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.replace("Forgetpassword");
          }}>
          <Text style={styles.logIn}>Forget Password?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btn: {
    marginRight: "4%",
    marginTop: "6%",
  },
  logIn: {
    marginTop: "7%",
    alignSelf: "center",
    color: "#4338CA",
    fontWeight: "400",
    fontSize: 20,
  },
  signupContainer: {
    left:0,
    width: "100%",
    marginTop: 90,
    justifyContent: "center",
    alignItems: "center",
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
    marginRight: 16,
    marginLeft: 16,
    marginBottom: 44,
  },
  button: {
    backgroundColor: "#67E8F9",
    width: "100%",
    height: 65,
    borderRadius: 14,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  banner: {
    justifyContent: "center",
    width: "100%",
    height: 120,
    marginTop: -140,
    alignSelf: "center",
  },
  buttonText: {
    color: "#27272A",
    fontWeight: "500",
    fontSize: 24,
  },
  inputText: {
    color: "black",
    fontWeight: "700",
    marginLeft: 40,
    marginBottom: 5,
    fontSize: 24,
    fontWeight: "700",
    width: "60%",
  },
});
