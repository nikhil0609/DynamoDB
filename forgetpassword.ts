import {
  SafeAreaView,
  Image,
  ImageBackground,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Icon, VStack } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/core";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { userPool } from "../services/userPool";
import { Asset } from "expo-asset";
import * as AWS from "aws-sdk";
const CognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({ apiVersion: "2016-04-18" });

import { loggedinUser } from "../constants/states";

AWS.config.update({
  region: "us-east-1",
  secretAccessKey: "85H57ONO4brCiZd+pvbYrIl1Y4AC66TTqvnfyfon",
  accessKeyId: "AKIAWRW334WTYAE6ZYB3",
  dynamoDbCrc32: false,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

export default function OnboardingForgetPassword() {
  const navigation = useNavigation();
  React.useState("placeholder text");
  const [email, onChangeEmail] = React.useState(null);

  const onSubmit = (event) => {
    if (email == null) {
      Alert.alert("Please enter your email");
    } else {
      const user = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      user.forgotPassword({
        onSuccess: (data) => {
          console.log("onSuccess:", data);
        },
        onFailure: (err) => {
          Alert.alert("The request couldn't be completed. Try again.");
          console.error(err);
        },
        inputVerificationCode: (data) => {
          console.log("Input code:", data);
          Alert.alert("If your email is registered with us then a verification code has been sent to your email.");
          navigation.navigate("Resetpassword", {
            email,
          });
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.signupContainer}>
        <ImageBackground
          source={require("../../assets/images/profile_banner.png")}
          resizeMode='contain'
          style={styles.banner}>
          <VStack space='3'>
            <Icon as={Ionicons} name='chevron-back-outline' style={styles.btn} size={10} onPress={navigation.goBack} />
          </VStack>
        </ImageBackground>
        <Text style={styles.signUpText}>Forget Password?</Text>
        <Text style={styles.descText}>Enter your Registered Email to receive a verification code</Text>
      </View>
      <View>
        <Text style={styles.inputText}>Email</Text>
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
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            onSubmit();
          }}
          disabled={!email}
          style={!email ? styles.disabled : styles.button}>
          <Text style={styles.buttonText}>Send Verification Code</Text>
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
  disabled: {
    backgroundColor: "#D3D3D3",
    width: "100%",
    height: 65,
    borderRadius: 14,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  logIn: {
    marginTop: "7%",
    alignSelf: "center",
    color: "#4338CA",
    fontWeight: "400",
    fontSize: 20,
  },
  signupContainer: {
    width: "100%",
    marginTop: 120,
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
    marginRight: 28,
    marginLeft: 28,
    marginTop: "35%",
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
    width: "60%",
  },
});
