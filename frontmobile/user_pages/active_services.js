import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, Text, Button, Image, StyleSheet, TextInput,
TouchableOpacity, SafeAreaView, ScrollView} from "react-native";
import React, { useEffect, useState }  from 'react';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Top_menu} from './all_services'
import GetServicesId from './GetServicesId';


export class Active_services extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            navigation : props.navigation
        };
    }

    get_page = () => {
        return(
        <View style={{width : '100%' ,height : 110, flexDirection : 'row', backgroundColor : 'black', marginLeft : 'auto', marginRight : 'auto'}}>
                <TouchableOpacity onPress={() => this.state.navigation.navigate("User")}><Text style = {{fontWeight: 'bold' ,marginTop : 60, marginLeft : 0 ,resizeMode: 'contain',height: 50, fontSize : 19, color : 'white'}} >all services</Text></TouchableOpacity>
                <Text style = {{fontWeight: 'bold' , marginTop : 60, marginLeft : 19 ,resizeMode: 'contain',height: 50, fontSize : 20, color : 'white', textDecorationLine : 'underline'}} >active services</Text>
                <TouchableOpacity onPress={() => this.state.navigation.navigate("Workspace_p")}><Text style = {{fontWeight: 'bold' , marginTop : 60, marginLeft : 20 ,resizeMode: 'contain',height: 50, fontSize : 19, color : 'white'}} >Workspace</Text></TouchableOpacity>
          </View>
        );
    }

    render(){
        return(
            <View>
            <Top_menu/>
            <this.get_page/>
            <SafeAreaView>
                    <ScrollView>
            <GetServicesId navigation={this.state.navigation}></GetServicesId>
            <View style = {{width : '100%', height : '30%', marginBottom : 500}}></View>
            </ScrollView>
            </SafeAreaView>
        </View>
        );

    }
}
