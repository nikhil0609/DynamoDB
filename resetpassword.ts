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
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useState, useContext } from "react";
import { useNavigation, useRoute } from "@react-navigation/core";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { userPool } from "../services/userPool";
import { Asset } from "expo-asset";
import * as AWS from "aws-sdk";
// import AccountContext from "../services/Account.js";
AWS.config.update({
  region: "us-east-1",
  secretAccessKey: "85H57ONO4brCiZd+pvbYrIl1Y4AC66TTqvnfyfon",
  accessKeyId: "AKIAWRW334WTYAE6ZYB3",
  dynamoDbCrc32: false,
});

const OnboardingResetPassword = () => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const navigation = useNavigation();
  const [passwd, onChangePwd] = React.useState(null);
  const [cpasswd, onConfirmePwd] = React.useState(null);
  const [code, setCode] = React.useState(null);
  React.useState("placeholder text");
  const route = useRoute();

  const onSubmit = (event) => {
    const email = route.params.email;
    if (code == null) {
      Alert.alert("Please enter verification code.");
    } else if (passwd == null || cpasswd == null) {
      Alert.alert("Password is required feild.");
    } else if (passwd !== cpasswd) {
      Alert.alert("Password and confirm password should be same.");
    } else if (passwd.length < 6 || cpasswd.length < 6) {
      Alert.alert("Password should be atleast 6 characters.");
    } else {

      const user = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      user.confirmPassword(code, passwd, {
        onSuccess: (data) => {
          console.log("onSuccess:", data);
          navigation.replace("Signin");
        },
        onFailure: (err) => {
          console.error("onFailure:", err);
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
        <Text style={styles.signUpText}>Create New Password</Text>
        <Text style={styles.descText}>Enter your new password</Text>
      </View>
      <KeyboardAwareScrollView>
        <View>
          <Text style={styles.inputText}>Verification Code</Text>
          <TextInput
            style={styles.textContainer}
            onChangeText={setCode}
            value={code}
            placeholder='Please enter the verification code'
            placeholderTextColor='#A3A3A3'
            keyboardType='numeric'
          />
          <Text style={styles.inputText}>New Password</Text>
          <TextInput
            style={styles.textContainer}
            secureTextEntry={true}
            onChangeText={onChangePwd}
            value={passwd}
            placeholder='Password At-least 6 digits'
            placeholderTextColor='#A3A3A3'
            keyboardType='default'
          />
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
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          disabled={!code || !passwd || !cpasswd}
          onPress={() => {
            // navigation.replace("Completion");
            onSubmit();
          }}
          style={!code || !passwd || !cpasswd ? styles.disabled : styles.button}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingResetPassword;

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
    width: "90%",
    height: 65,
    padding: 10,
    marginLeft: 20,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  signupContainer: {
    width: "100%",
    marginTop: 120,
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
    marginBottom: 60,
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
  buttonText: {
    color: "#27272A",
    fontWeight: "500",
    fontSize: 24,
    fontStyle: "normal",
  },
  banner: {
    justifyContent: "center",
    width: "100%",
    height: 120,
    marginTop: -140,
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
