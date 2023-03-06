import React from "react";
import GetServicesData from "./GetServicesData";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, Text, Button, Image, StyleSheet, TextInput,
    TouchableOpacity, SafeAreaView, ScrollView, FlatList} from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import {Top_menu} from './all_services'
import { styles } from "../App";
import { NavigationHelpersContext } from "@react-navigation/native";

export class Print_Worspace extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            navigation : props.navigation,
            areas : [],
            loaded : false
        };
        this.activate_services = this.activate_services.bind(this);
    }

    async componentDidMount(){
        fetch(
            "http://localhost:8080/user/" + await AsyncStorage.getItem("id") + "/area",
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + await AsyncStorage.getItem("token"),
              },
            }
          )
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    areas : json
                    }
                );
                this.setState({
                    loaded : true
                });
                console.log(json);
            })
            .catch((err) => {
              console.log(err);
            });
        }

    DeleteArea = async (id) => {
            const res = await fetch("http://localhost:8080/area/" + id, {
              method: "DELETE",
              headers: {
                Authorization: "Bearer " + await AsyncStorage.getItem("token"),
              },
            });
          };

        async activate_services(id){
            fetch(
                "http://localhost:8080/area/" + id + "/state",
                {
                  method: "PUT",
                  headers: {
                    Authorization: "Bearer " + await AsyncStorage.getItem("token"),
                  },
                }
              )
                .then((res) => console.log(res))
                .catch((err) => {
                  console.log(err);
                });
        }

    get_page = () => {
            return(
            <View style={{width : '100%' ,height : 110, flexDirection : 'row', backgroundColor : 'black', borderRadius : 0, marginLeft : 'auto', marginRight : 'auto'}}>
                    <TouchableOpacity onPress={() => this.state.navigation.navigate("User")}><Text style = {{fontWeight: 'bold' ,marginTop : 60, marginLeft : 0 ,resizeMode: 'contain',height: 50, fontSize : 19, color : 'white'}} >all services</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.state.navigation.navigate("Actif")}><Text style = {{fontWeight: 'bold' , marginTop : 60, marginLeft : 19 ,resizeMode: 'contain',height: 50, fontSize : 20, color : 'white'}} >active services</Text></TouchableOpacity>
                    <Text style = {{fontWeight: 'bold' , marginTop : 60, marginLeft : 20 ,resizeMode: 'contain',height: 50, fontSize : 19, textDecorationLine : 'underline' , color : 'white'}} >Workspace</Text>
              </View>
            );
        }

    Card = ({name, state, id}) => {
        return(
            <View style= {{width : '90%', height : 120, borderRadius : 10, backgroundColor : 'grey', marginTop : 50, marginLeft: 'auto', marginRight : 'auto'}}>
                <Text style = {{textAlign : 'center', fontWeight : 'bold', fontSize : 30}}>{name}</Text>
            <View style = {{flexDirection : 'row', justifyContent : 'space-between'}}>
            <TouchableOpacity style = {[{width : 100, height : 50,},  state ? {backgroundColor : "green"} : {backgroundColor : "red"} , {borderRadius : 10 , marginTop : 20}]} onPress= {() => this.activate_services(id)}>
                <Text style = {{textAlign : 'center',  marginTop : 'auto', marginBottom : 'auto'}}>{!state ? "Enable" : "Disable"}</Text>
            </TouchableOpacity>
                <TouchableOpacity style = {[{width : 100, height : 50,},  state ? {backgroundColor : "green"} : {backgroundColor : "red"} , {borderRadius : 10 , marginTop : 20}]} onPress= {() => this.DeleteArea(id)}>
                    <Text style = {{textAlign : 'center',  marginTop : 'auto', marginBottom : 'auto'}}>Delete</Text>
                </TouchableOpacity>
            </View>
            </View>
            
        );

    }

    render(){
        if (this.state.loaded){
            return(
                <View>
                    <Top_menu ></Top_menu>
            <this.get_page></this.get_page>
                <>
            {this.state.areas.map((service, index) => (
            <this.Card name={service.name} key={index} state={service.actif} id = {service._id}/>
            ))}
        </>
            </View>
            );
        } else {
            return (
            <View>
                  <Top_menu ></Top_menu>
            <this.get_page></this.get_page>
            <Text> loading ...</Text>
            </View>
            );
        }

    }


}