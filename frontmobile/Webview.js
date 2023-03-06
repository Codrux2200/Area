import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, Text, Button, Image, StyleSheet, TextInput,
TouchableOpacity, SafeAreaView, ScrollView} from "react-native";
import React, { useEffect, useState }  from 'react';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';
import { LogBox } from 'react-native';
//LogBox.ignoreLogs(['Encountered an error loading page']);
//this.state.url + "?token=" + this.state.token + "&service_id=" + this.state.service_id 

export class Fun_WebView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            navigation : props.navigation,
            url : props.route.params.url,
            service_id : props.route.params.service_id,
            url1 : "http://google.com"
        };
    }

    async componentDidMount(){
        let token = await AsyncStorage.getItem("id");
        this.setState({token});
        this.setState({url1 : this.state.url + "?token=" + this.state.token + "&service_id=" + this.state.service_id});
    }

    render(){
        if (this.state.token){
            console.log(this.state.url + "?token=" + this.state.token + "&service_id=" + this.state.service_id);
            return(
            <View style = {{width : '100%', height : '100%'}}>
            <TouchableOpacity style = {{marginTop : 50}} onPress={() => this.state.navigation.navigate("Actif")}><Text>Return</Text></TouchableOpacity>
            <SafeAreaView style = {{width : '100%', height : '90%', marginTop : 30}}>
            <WebView userAgent={Platform.OS === 'android' ? 'Chrome/18.0.1025.133 Mobile Safari/535.19' : 'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75'} source={{ uri: this.state.url + "?token=" + this.state.token + "&service_id=" + this.state.service_id}}
            />
            </SafeAreaView>
            </View>
            );
        } else {
            return(<View></View>);
        }
    }
}


// export const Fun_WebView = async ({route, navigation}) => {
//     const token = await AsyncStorage.getItem("token");

//     if (token == {_h, _i, _j, _k}){
//         return (<View></View>);
//     }

//     return(
//         <View style = {{width : '100%', height : '100%'}}>
//         <TouchableOpacity style = {{marginTop : 50}} onPress={() => navigation.navigate("Actif")}><Text>Return</Text></TouchableOpacity>
//         <SafeAreaView style = {{width : '100%', height : '90%', marginTop : 30}}>
//         <WebView userAgent={Platform.OS === 'android' ? 'Chrome/18.0.1025.133 Mobile Safari/535.19' : 'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75'} source={{ uri: route.params.url + "?token=" + token + "&service_id=" + route.params.service_id }} />
//         </SafeAreaView>
//         </View>
//     );
// }