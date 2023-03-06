/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, Text, Button, Image, StyleSheet, TextInput, TouchableOpacity} from "react-native";
import React from 'react';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {User_home} from './user_pages/all_services'
import {Active_services} from './user_pages/active_services'
import { Fun_WebView } from './Webview';
import {Workspace_Page, Workspace_Page_Reaction} from './user_pages/Workspace'
import { Print_Worspace } from './user_pages/Print_Workspace';

const Stack = createNativeStackNavigator();


class Login extends React.Component {
  constructor(props){
    super(props);
    AsyncStorage.setItem("action", "");
    this.state = {
      email : "",
      password : "",
      navigation : props.navigation,
      Credentials : ""
    };
    this.Inputs = this.Inputs.bind(this);
    this.login = this.login.bind(this);
  }

  login = async () => {
    this.state.Credentials = "";
    if (this.state.email.length === 0 || this.state.password.length === 0) {
      this.state.Credentials = "Invalid this.state.Credentials";
      return;
    }
    try {
      const res = await fetch("http://" + await AsyncStorage.getItem("ip") + ":8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.state.email,
          password: this.state.password,
        }),
      });
      const response = await res.json();
      if (response.message === "username doesnt exist")
        this.state.Credentials = "Username doesnt exist";
      else if (response.message === "password incorrect")
        this.state.Credentials = "Password incorrect";
      else {
        await AsyncStorage.setItem("token", response.token);
        await AsyncStorage.setItem("id", response.userId);
        this.state.navigation.navigate('User');
      }
    } catch (error) {
      throw new Error("Issue with Register", error.message);
    }
  };
  
  Inputs = (props) => {
    return(
      <View>
        <Text style = {{marginLeft : 40, color : "white"}}>{props.name}</Text>
        <TextInput style={styles.input_style} onChangeText = {(text) =>
        props.name == "Email" ?  this.setState({email : text}) : this.setState({password : text})}></TextInput>
      </View>
    );
  }

  render(){
    AsyncStorage.getItem("ip").then((response) => console.log(response));
    return(
      <View style = {{backgroundColor : 'rgba(125, 19, 191, 1)', height : '100%'}}>
          <Text style = {{marginTop : 50, textAlign : "center", fontWeight : "bold"}} >Set the ip</Text>
          <TextInput style={[styles.input_style, ]} onChangeText = {(text) => AsyncStorage.setItem("ip", text)}></TextInput>
          <Image style={[styles.center_image, {marginTop : 60}]} source={require('./assets/Logo.png')}></Image>
          <this.Inputs name="Email"/>
          <this.Inputs name="Password"/>
          <TouchableOpacity onPress={this.login} style = {{width : 250, height : 60, borderRadius : 10, backgroundColor : 'rgba(180, 179, 179, 1)', marginTop : 30, marginLeft: 'auto', marginRight : 'auto'}}>
            <Text style = {{textAlign : 'center', marginTop : 'auto', marginBottom : 'auto'}}>
              Se connecter
            </Text>
          {/* <BouncyCheckbox style = {{marginLeft : 30}} iconStyle = {styles.Check_box_style} fillColor = 'rgba(0, 0, 0, 0)' onPress={() => {}} />
          <Text style = {{color : "white"}}>Remember me ?</Text> */}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.state.navigation.navigate('Register')}>
          <Text style = {{textAlign : 'center', marginLeft : 50, textDecorationLine : 'underline', textTransform : 'uppercase'}}>register</Text>
          </TouchableOpacity>
          {/* EN CHANTIER */}
      </View>    
      );
  }
}


class Register extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email : "",
      password : "",
      navigation : props.navigation,
      Already : ""
    };
    this.Inputs = this.Inputs.bind(this);
    this.getToken = this.getToken.bind(this);
    this.register = this.register.bind(this);
  }
  
  Inputs = (props) => {
    return(
      <View>
        <Text style = {{marginLeft : 40, color : "white"}}>{props.name}</Text>
        <TextInput style={styles.input_style} onChangeText = {(text) =>
        props.name == "Email" ?  this.setState({email : text}) : this.setState({password : text})}></TextInput>
      </View>
    );
  }


  register = async () => {
    this.state.Already = "";
    if (this.state.email.length === 0 || this.state.password.length === 0) {
      this.state.Already = "Invalid credentials";
      return;
    }
    try {
      const res = await fetch("http://" + await AsyncStorage.getItem("ip") + ":8080/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.state.email,
          password: this.state.password,
        }),
      });
      const response = await res.json();
      if (response.message === "user already exists")
      this.state.Already = "User already exists";
      else this.getToken();
    } catch (error) {
      throw new Error("Issue with Register", error.message);
    }
  };

  getToken = async () => {
    try {
      const res = await fetch("http://"  + await AsyncStorage.getItem("ip") + ":8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.state.email,
          password: this.state.password,
        }),
      });
      const response = await res.json();
      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("id", response.userId);
      this.state.navigation.navigate('User');
    } catch (error) {
      throw new Error("Issue with Token", error.message);
    }
  };

  render(){
    return(
      <View style = {{backgroundColor : 'rgba(125, 19, 191, 1)', height : '100%'}}>
          <Image style={[styles.center_image, {marginTop : 60}]} source={require('./assets/Logo.png')}></Image>
          <this.Inputs name="Email"/>
          <this.Inputs name="Password"/>
          <TouchableOpacity onPress={this.register} style = {{width : 250, height : 60, borderRadius : 10, backgroundColor : 'rgba(180, 179, 179, 1)', marginTop : 30, marginLeft: 'auto', marginRight : 'auto'}}>
            <Text style = {{textAlign : 'center', marginTop : 'auto', marginBottom : 'auto'}}>
              s'inscrire
            </Text>
          {/* <BouncyCheckbox style = {{marginLeft : 30}} iconStyle = {styles.Check_box_style} fillColor = 'rgba(0, 0, 0, 0)' onPress={() => {}} />
          <Text style = {{color : "white"}}>Remember me ?</Text> */}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.state.navigation.navigate('Login')}>
          <Text style = {{textAlign : 'center', marginLeft : 50, textDecorationLine : 'underline', textTransform : 'uppercase'}}>vous avez deja un compte : login</Text>
          </TouchableOpacity>
          {/* EN CHANTIER */}
      </View>    
      );
  }
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}} 
        />
        <Stack.Screen name="Register" component={Register} options={{headerShown: false}}  />
        <Stack.Screen name="User" component={User_home} options={{headerShown: false}}  />
        <Stack.Screen name="Actif" component={Active_services} options={{headerShown: false}}  />
        <Stack.Screen name="Web" component={Fun_WebView} options={{headerShown: false, url : "", webView : "", service_id : ""}}  />
        <Stack.Screen name="Workspace" component={Workspace_Page} options={{headerShown: false, action : ""}}  />
        <Stack.Screen name="Workspace_r" component={Workspace_Page_Reaction} options={{headerShown: false, action : ""}}  />
        <Stack.Screen name="Workspace_p" component={Print_Worspace} options={{headerShown: false}}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

export const styles = StyleSheet.create({

  center_image : {
    marginLeft : "auto", 
    marginRight : "auto"
  },
  input_style : {
    height: 50, 
    margin: 12, 
    borderWidth: 1, 
    padding: 10, 
    backgroundColor : 'rgba(180, 179, 179, 1)', 
    borderRadius : 15, 
    width : "80%",
    marginLeft : "auto",
    marginRight : "auto"
  },
  Check_box_style : {
    backgroundColor : "black", 
    borderRadius : 0, 
    borderColor : "black", 
    width : 20, 
    height : 20
  }



});
