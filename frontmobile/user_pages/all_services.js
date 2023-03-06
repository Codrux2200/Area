import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, Text, Button, Image, StyleSheet, TextInput,
TouchableOpacity, SafeAreaView, ScrollView} from "react-native";
import React, { useEffect, useState }  from 'react';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';
import {Workspace_Page} from './Workspace';

const Card = ({name, img_url, url, service_id, navigation}) => {
    const [webView, setBoll] = useState(null);
    // const EnableService = async () => {
    //   // const res = await fetch(
    //   //   "http://localhost:8080/user/" + await AsyncStorage.getItem("id") + "/service",
    //   //   {
    //   //     method: "PUT",
    //   //     headers: {
    //   //       Authorization: "Bearer " + await AsyncStorage.getItem("token"),
    //   //       "Content-Type": "application/json",
    //   //     },
    //   //     body: JSON.stringify({
    //   //       name: name,
    //   //     }),
    //   //   }
    //   // );
    // };
    return (
      <View style = {{width : '100%', height : '100%',  flex : 3}}>
        <View style = {{width : '80%', height : 200, borderRadius : 30, backgroundColor : 'rgba(0, 0, 0, 0.74)', marginTop : 50, marginLeft: 'auto', marginRight : 'auto'}}>  
          <View style = {{width : '100%', marginLeft : 'auto', marginRight : 'auto', backgroundColor : 'grey', height : 50, borderRadius : 10, flexDirection : 'row', justifyContent : 'space-between' }}>
          <Text style = {{color : 'white', fontWeight : 'bold', marginLeft : 10, fontSize : 30, marginTop : 2}}>{name}</Text>
          <Image source={{uri : img_url}} style = {{width : 30, height : 30, marginRight : 20, marginTop : 2}}></Image>
          </View>
          <TouchableOpacity style = {{width : '50%', height : '40%', backgroundColor : 'grey', borderRadius : 10, marginTop : 20, marginLeft : 'auto', marginRight : 'auto'}} onPress={() => navigation.navigate("Web", {url : url.replace("localhost", "10.15.179.168"), service_id : service_id})}>
          <Text style = {{fontSize : 30, fontWeight : "bold", textAlign : 'center', marginTop:'auto', marginBottom : 'auto'}}>Enable</Text>
          </TouchableOpacity>
        </View>
      </View>

    );
  };

const AllServices = ({navigation}) => {
    const [response, setResponse] = useState([]);
    const [new_uid, set_uid] = useState("");
    useEffect(() => {
      const getServicesName = async () => {
        const res = await fetch("http://"  + await AsyncStorage.getItem("ip") + ":8080/service", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + await AsyncStorage.getItem("token"),
          },
        });
        setResponse(await res.json());
        set_uid(await AsyncStorage.getItem("ip"));
        console.log(new_uid);
        console.log(response);
      };
      getServicesName();
    }, []);
    return (
      <>
        {response.map((service, index) => (
          <Card key={index} name={service.name} img_url={service.img_url} url={service.connection_url.replace("localhost", new_uid).replace("127.0.0.1", new_uid)} service_id={service._id} navigation = {navigation}/>
        ))}
      </>
    );
  };


export const Top_menu = () => {
    return(
        <View style={{height : 110, backgroundColor : 'rgba(125, 19, 191, 1)', flexDirection : 'row'}}>
        <Image style = {{marginTop : 50, marginLeft : -60,resizeMode: 'contain',height: 50}}  source={require('../assets/Logo_seul.png')}/>
        <Text style = {{marginTop : 60, marginLeft : 20 ,resizeMode: 'contain',height: 50, color : 'white', fontSize : 30}} >ARIA</Text>
        </View>
    );
}


export class User_home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            navigation : this.props.navigation
        };
        this.get_page = this.get_page.bind(this);
    }
    
    get_page = () => {
        return(
        <View style={{width : '100%' ,height : 110, flexDirection : 'row', backgroundColor : 'black', borderRadius : 0, marginLeft : 'auto', marginRight : 'auto'}}>
                <Text style = {{fontWeight: 'bold' ,marginTop : 60, marginLeft : 0 ,resizeMode: 'contain',height: 50, fontSize : 19, textDecorationLine : 'underline', color : 'white'}} >all services</Text>
                <TouchableOpacity onPress={() => this.state.navigation.navigate("Actif")}><Text style = {{fontWeight: 'bold' , marginTop : 60, marginLeft : 19 ,resizeMode: 'contain',height: 50, fontSize : 20, color : 'white'}} >active services</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => this.state.navigation.navigate("Workspace_p")}><Text style = {{fontWeight: 'bold' , marginTop : 60, marginLeft : 20 ,resizeMode: 'contain',height: 50, fontSize : 19, color : 'white'}}>Workspace</Text></TouchableOpacity>
          </View>
        );
    }

    

    render (){
        return(
            <View>
                <Top_menu/>
                <this.get_page/>
                <SafeAreaView>
                    <ScrollView>
                <AllServices navigation = {this.state.navigation}></AllServices>
                <View style = {{width : '100%', height : '30%', marginBottom : 500}}></View>
                </ScrollView>
                </SafeAreaView>
            </View>


        );
    }

}


export class Active_services extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            navigation : this.props.navigation
        };
        this.get_page = this.get_page.bind(this);
    }
    
    get_page = () => {
        return(
        <View style={{height : 110, flexDirection : 'row'}}>
                <Text style = {{marginTop : 60, marginLeft : 20 ,resizeMode: 'contain',height: 50, fontSize : 20}} >all services</Text>
                <Text style = {{marginTop : 60, marginLeft : 20 ,resizeMode: 'contain',height: 50, fontSize : 20, textDecorationLine : 'underline'}} >active services</Text>
                <Text style = {{marginTop : 60, marginLeft : 20 ,resizeMode: 'contain',height: 50, fontSize : 20}} >Workspace</Text>
                </View>
        );
    }


    render (){
        return(
            <View>
                <Top_menu/>
                <this.get_page/>
            </View>


        );
    }

}