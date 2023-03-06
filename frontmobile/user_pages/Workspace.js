import React from "react";
import GetServicesData from "./GetServicesData";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, Text, Button, Image, StyleSheet, TextInput,
    TouchableOpacity, SafeAreaView, ScrollView, FlatList} from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import {Top_menu} from './all_services'
import { styles } from "../App";


export class Workspace_Page extends React.Component {
    constructor(props){
        super(props);
        AsyncStorage.setItem("action", "");
        this.state = {
            action_service_id : props.route.params.action,
            reaction_service_id : "",
            reaction_id : "",
            action_id : "",
            id_choose : 0,
            args : [],
            navigation : props.navigation,
            resi : [{name : "hey"}],
            service : {}
        };
        this.Choose_action = this.Choose_action.bind(this);
        this.Params_card = this.Params_card.bind(this);
        this.Submit = this.Submit.bind(this);
    }

    componentDidMount = async () => {
        if (this.state.action_service_id != undefined){
            fetch(
                "http://"  + await AsyncStorage.getItem("ip") + ":8080/service/" + this.state.action_service_id + "/action",
                {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + await AsyncStorage.getItem("token"),
                },
                }
            ).then((val) => val.json()).then((json) => this.setState({resi: json}));
            
            fetch(
                "http://"  + await AsyncStorage.getItem("ip") + ":8080/service/" + this.state.action_service_id,
                {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + await AsyncStorage.getItem("token"),
                },
                }
            ).then((val) => val.json()).then((json) => this.setState({service : json}));

        }
    }

    Params_card = (item) => {
        console.log(item);
        return(
            item.key - 1 >= 0 ?
            <View>
            <Text syle = {{textAlign : 'center'}}>{item.arg}</Text>  
            <TextInput style = {{width : 100, height : 50, borderWidth: 1, 
            padding: 10, borderRadius : 20, backgroundColor : 'white'}} onChangeText = {(text) => this.state.args[item.key - 1] = text}></TextInput>
            </View> : <></>
        );
    }

    get_page = () => {
        return(
        <View style={{width : '100%' ,height : 110, flexDirection : 'row', backgroundColor : 'black', borderRadius : 0, marginLeft : 'auto', marginRight : 'auto'}}>
                <Text style = {{fontWeight: 'bold' ,marginTop : 60, marginLeft : 0 ,resizeMode: 'contain',height: 50, fontSize : 19, color : 'white'}} >all services</Text>
                <TouchableOpacity onPress={() => this.state.navigation.navigate("Actif")}><Text style = {{fontWeight: 'bold' , marginTop : 60, marginLeft : 19 ,resizeMode: 'contain',height: 50, fontSize : 20, color : 'white'}} >active services</Text></TouchableOpacity>
                <Text style = {{fontWeight: 'bold' , marginTop : 60, marginLeft : 20 ,resizeMode: 'contain',height: 50, fontSize : 19, textDecorationLine : 'underline' , color : 'white'}} >Workspace</Text>
          </View>
        );
    }


    Submit = () => {
        if (this.state.action_id != "" && this.state.service_id != "" && this.state.args != []){
            let action = {
                action_id : this.state.action_id,
                service_id : this.state.action_service_id,
                args : this.state.args,
            }
            console.log(action);
            AsyncStorage.setItem("action", JSON.stringify(action));
            this.state.navigation.navigate("Actif");
        }else{
            console.log("error area");
        } 
    }


    Choose_action = () =>{
        let tab = [];
        let args = [];
        if (this.state.resi != [] && this.state.resi[0].name != 'key' && this.state.resi[0].args != undefined){
            tab = [];
            args = [];
            for(var i = 0; i != this.state.resi.length; i++){
                tab.push({label : this.state.resi[i].name, value : this.state.resi[i]._id});
            }
            if (this.state.id_choose - 1 >= 0){
                for (var i = 0; i < this.state.resi[this.state.id_choose - 1].args.length; i++){
                    args.push({key : i + 1, arg : this.state.resi[this.state.id_choose - 1].args[i]})
                }
            } else{
                args.push({key : 0, arg : "nothing"});
            }
            return(
                <View style = {{marginTop : 100, width : '100%', height : '50%', backgroundColor : 'grey', borderRadius : 20}}>
                    <View style = {{marginTop : 3, width : '100%', height : '20%', backgroundColor : 'black', borderRadius : 20, flexDirection : 'row', justifyContent : 'space-between'}}>
                        <Text style = {{fontWeight : 'bold', color : 'white', marginLeft : 20, marginTop : 'auto', marginBottom : 'auto', fontSize : 20}}>{this.state.service.name}</Text>
                        <View style = {{width: 40, height : 40, marginRight : 20, marginTop : 'auto', marginBottom : 'auto'}}>
                        <Image source = {{uri :this.state.service.img_url, width: 40, height : 40}} ></Image>
                        </View>

                    </View>
                        <View style = {{marginLeft : 'auto', marginRight : 'auto', backgroundColor : 'white', borderRadius : 10, width : '50%', marginTop : '20%'}}>
                            <RNPickerSelect
                    onValueChange={(value, id) => this.setState({action_id : value, id_choose : id})}
                    items= {tab}
                    placeholder = "Select an Action"
                    />
                        </View>
                        {(this.state.id_choose - 1) >= 0 ?
                        <Text style = {{fontWeight : 'bold', color : 'white', textAlign : 'center', marginTop : 20, fontSize : 20}}>{this.state.resi[this.state.id_choose - 1].description}</Text> : <></>}
                        <SafeAreaView style = {{marginLeft : 'auto', marginRight: 'auto', marginTop : 40}}>
                            <FlatList
                                data={args}
                                renderItem={(item) => this.Params_card(item.item)}
                                keyExtractor={item => item.id}
                                horizontal = {true}
                                ItemSeparatorComponent = {<View style = {{marginLeft: 30}}></View>}
                            />
                            </SafeAreaView>
                    <Button title = {"submit"} onPress={this.Submit}></Button>
                </View>
                

            );
        } else {
            return (
                <View>
                    <Text>Loading..</Text>

                </View>

            );
        }
    }

    render(){

        return(
        <View>
            <Top_menu></Top_menu>
        <this.get_page></this.get_page>
        <this.Choose_action></this.Choose_action>
        </View>
        )

    }
}







export class Workspace_Page_Reaction extends React.Component {
    constructor(props){
        super(props);
        AsyncStorage.setItem("reaction", "");
        this.state = {
            action_service_id : props.route.params.action,
            reaction: "",
            reaction_id : "",
            action_id : "",
            id_choose : 0,
            args : [],
            navigation : props.navigation,
            resi : [{name : "hey"}],
            service : {},
            name : ""
        };
        this.Choose_action = this.Choose_action.bind(this);
        this.Params_card = this.Params_card.bind(this);
        this.Submit = this.Submit.bind(this);
        this.Create_Area = this.Create_Area.bind(this);
    }

    componentDidMount = async () => {
        if ( this.state.action_service_id != undefined){
            fetch(
                "http://"  + await AsyncStorage.getItem("ip") + ":8080/service/" + this.state.action_service_id + "/reaction",
                {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + await AsyncStorage.getItem("token"),
                },
                }
            ).then((val) => val.json()).then((json) => this.setState({resi: json}));
            
            fetch(
                "http://"  + await AsyncStorage.getItem("ip") + ":8080/service/" + this.state.action_service_id,
                {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + await AsyncStorage.getItem("token"),
                },
                }
            ).then((val) => val.json()).then((json) => this.setState({service : json}));

        }
    }

    Params_card = (item) => {
        console.log(item);
        return(
            item.key - 1 >= 0 ?
            <View>
            <Text syle = {{textAlign : 'center'}}>{item.arg}</Text>  
            <TextInput style = {{width : 100, height : 50, borderWidth: 1, 
            padding: 10, borderRadius : 20, backgroundColor : 'white'}} onChangeText = {(text) => this.state.args[item.key - 1] = text}></TextInput>
            </View> : <></>
        );
    }

    get_page = () => {
        return(
        <View style={{width : '100%' ,height : 110, flexDirection : 'row', backgroundColor : 'black', borderRadius : 0, marginLeft : 'auto', marginRight : 'auto'}}>
                <Text style = {{fontWeight: 'bold' ,marginTop : 60, marginLeft : 0 ,resizeMode: 'contain',height: 50, fontSize : 19, color : 'white'}} >all services</Text>
                <TouchableOpacity onPress={() => this.state.navigation.navigate("Actif")}><Text style = {{fontWeight: 'bold' , marginTop : 60, marginLeft : 19 ,resizeMode: 'contain',height: 50, fontSize : 20, color : 'white'}} >active services</Text></TouchableOpacity>
                <Text style = {{fontWeight: 'bold' , marginTop : 60, marginLeft : 20 ,resizeMode: 'contain',height: 50, fontSize : 19, textDecorationLine : 'underline' , color : 'white'}} >Workspace</Text>
          </View>
        );
    }


    Submit = () => {
        console.log(this.state.name, this.state.action_id, this.state.action_service_id, this.state.args);
        if (this.state.name != "" && this.state.action_id != "" && this.state.action_service_id != "" && this.state.args != []){
            this.setState({reaction : {
                action_id : this.state.action_id,
                service_id : this.state.action_service_id,
                args : this.state.args,
            }});
            this.Create_Area();
        } else {
            console.log("the area is not completed");
        }
    }


    Create_Area = async () => {
        let json_action = await JSON.parse(await AsyncStorage.getItem("action"));

        let body_send = {
            action_id : json_action.action_id,
            reaction_id : this.state.reaction.action_id,
            action_arg : json_action.args.toString(),
            reaction_arg : this.state.reaction.args,
            user_id : await AsyncStorage.getItem("id"),
            name : this.state.name
        }
        fetch(
            "http://"  + await AsyncStorage.getItem("ip") + ":8080/area/",
            {
            method: "POST",
            headers: {
                Authorization: "Bearer " + await AsyncStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body : JSON.stringify(body_send)
            }
        )
        AsyncStorage.setItem("action", "");
        this.state.navigation.navigate("User");
    }


    Choose_action = () =>{
        let tab = [];
        let args = [];
        if (this.state.resi != [] && this.state.resi[0].name != 'key' && this.state.resi[0].args != undefined){
            tab = [];
            args = [];
            for(var i = 0; i != this.state.resi.length; i++){
                console.log(this.state.resi[i].name);
                tab.push({label : this.state.resi[i].name, value : this.state.resi[i]._id});
            }
            if (this.state.id_choose - 1 >= 0){
                for (var i = 0; i < this.state.resi[this.state.id_choose - 1].args.length; i++){
                    args.push({key : i + 1, arg : this.state.resi[this.state.id_choose - 1].args[i]})
                }
            } else{
                args.push({key : 0, arg : "nothing"});
            }
            return(
                <View style = {{marginTop : 80, width : '100%', height : '60%', backgroundColor : 'grey', borderRadius : 20}}>
                      <TextInput style = {{width : 150, height : 50, borderWidth: 1, 
            padding: 10, borderRadius : 20, backgroundColor : 'white', marginLeft : 'auto', marginRight : 'auto'}} placeholder = "Give a name to the Area" onChangeText={(text) => this.setState({name : text})}></TextInput>
                    <View style = {{marginTop : 3, width : '100%', height : '20%', backgroundColor : 'black', borderRadius : 20, flexDirection : 'row', justifyContent : 'space-between'}}>
                        <Text style = {{fontWeight : 'bold', color : 'white', marginLeft : 20, marginTop : 'auto', marginBottom : 'auto', fontSize : 20}}>{this.state.service.name}</Text>
                        <View style = {{width: 40, height : 40, marginRight : 20, marginTop : 'auto', marginBottom : 'auto'}}>
                        <Image source = {{uri :this.state.service.img_url, width: 40, height : 40}} ></Image>
                        </View>

                    </View>
                        <View style = {{marginLeft : 'auto', marginRight : 'auto', backgroundColor : 'white', borderRadius : 10, width : '50%', marginTop : '20%'}}>
                            <RNPickerSelect
                    onValueChange={(value, id) => this.setState({action_id : value, id_choose : id})}
                    items= {tab}
                    placeholder = "Select an Action"
                    />
                        </View>
                        {(this.state.id_choose - 1) >= 0 ?
                        <Text style = {{fontWeight : 'bold', color : 'white', textAlign : 'center', marginTop : 20, fontSize : 20}}>{this.state.resi[this.state.id_choose - 1].description}</Text> : <></>}
                        <SafeAreaView style = {{marginLeft : 'auto', marginRight: 'auto', marginTop : 40}}>
                            <FlatList
                                data={args}
                                renderItem={(item) => this.Params_card(item.item)}
                                keyExtractor={item => item.id}
                                horizontal = {true}
                                ItemSeparatorComponent = {<View style = {{marginLeft: 30}}></View>}
                            />
                            </SafeAreaView>
                    <Button title = {"submit"} onPress={this.Submit}></Button>
                </View>
                

            );
        } else {
            return (
                <View>
                    <Text>Loading..</Text>

                </View>

            );
        }
    }

    render(){

        return(
        <View>
            <Top_menu></Top_menu>
        <this.get_page></this.get_page>
        <this.Choose_action></this.Choose_action>
        </View>
        )

    }
}