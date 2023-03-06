import React from "react";
import GetServicesData from "./GetServicesData";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, Text, Button, Image, StyleSheet, TextInput,
    TouchableOpacity, SafeAreaView, ScrollView, ProgressBarAndroidBase} from "react-native";
    
class GetServicesId extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigation : props.navigation,
      items: [],
      isLoaded: false,
    };
  }

  async componentDidMount() {
    fetch("http://"  + await AsyncStorage.getItem("ip") + ":8080/user/" + await AsyncStorage.getItem("id"), {
      method: "GET",
      headers: {
        Authorization: "Bearer " + await AsyncStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          items: json,
          isLoaded: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { isLoaded, items } = this.state;

    if (!isLoaded) return;

    return (
      <View>
        <GetServicesData id={items} navigation={this.state.navigation}></GetServicesData>
      </View>
    );
  }
}

export default GetServicesId;