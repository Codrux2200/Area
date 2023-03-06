import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, Text, Button, Image, StyleSheet, TextInput,
  TouchableOpacity, SafeAreaView, ScrollView} from "react-native";



const ConnectedCard = ({ name, img_url, id, navigation }) => {


  const DisableService = async () => {
    const res = await fetch(
      "http://"  + await AsyncStorage.getItem("ip") + ":8080/user/" +
        await AsyncStorage.getItem("id") +
        "/service/" +
        id,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + await AsyncStorage.getItem("token"),
        },
      }
    );
  };

  const get_id = async () => {
      console.log("caca" + await AsyncStorage.getItem("action"));
      if (await AsyncStorage.getItem("action") == ""){
        return false;
      }
      return true;
  }

  return (
       <View style = {{width : '80%', height : 200, borderRadius : 30, backgroundColor : 'rgba(0, 0, 0, 0.74)', marginTop : 50, marginLeft: 'auto', marginRight : 'auto', flex : 2}}>  
        <View style = {{width : '100%', marginLeft : 'auto', marginRight : 'auto', backgroundColor : 'grey', height : 50, borderRadius : 10, flexDirection : 'row', justifyContent : 'space-between' }}>
        <Text style = {{color : 'white', fontWeight : 'bold', marginLeft : 10, fontSize : 30, marginTop : 2}}>{name}</Text>
        <Image source={{uri : img_url}} style = {{width : 30, height : 30, marginRight : 20, marginTop : 2}}></Image>
        </View>
        <View style = {{flexDirection : 'row', width : '100%', height : '100%', justifyContent : 'space-around'}}>
        <TouchableOpacity style = {{width : '30%', height : '20%', backgroundColor : 'grey', borderRadius : 10, marginTop : 20}} onPress={DisableService}>
        <Text style = {{fontSize : 20, fontWeight : "bold", textAlign : 'center', marginTop:'auto', marginBottom : 'auto'}}>disable</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {{width : '30%', height : '20%', backgroundColor : 'grey', borderRadius : 10, marginTop : 20}} onPress={async () => await AsyncStorage.getItem("action") == null ? navigation.navigate("Workspace", {action : id}) : navigation.navigate("Workspace_r", {action : id})}>
        <Text style = {{fontSize : 20, fontWeight : "bold", textAlign : 'center', marginTop:'auto', marginBottom : 'auto'}}>choose</Text>
        </TouchableOpacity>
        </View>
     </View>
    
  );
};

export default ConnectedCard;
