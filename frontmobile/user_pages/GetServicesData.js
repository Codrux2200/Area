import React from "react";
import ConnectedCard from "./ConnectedCard";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, Text, Button, Image, StyleSheet, TextInput,
  TouchableOpacity, SafeAreaView, ScrollView} from "react-native";
import { ThemeProvider } from "@react-navigation/native";
class GetServicesData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigation : props.navigation,
      items: [],
      isLoaded: false,
    };
  }
  async componentDidMount() {
    if (this.props.id.services.length != 0) {
      for (let i = 0; i < this.props.id.services.length; i++) {
        fetch(
          "http://"  + await AsyncStorage.getItem("ip") + ":8080/service/" + this.props.id.services[i]._id,
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
              items: this.state.items.concat(json),
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    this.state.isLoaded = true;
  }
  render() {
    const { isLoaded, items } = this.state;

    if (!isLoaded) return;
    let val = 0;
    return (
      <View>
        {console.log(items)}
        {items.map((item, index) => (
          <ConnectedCard
            key = {val ++}
            name={item.name}
            img_url={item.img_url}
            id={this.props.id.services[index]._id}
            navigation = {this.state.navigation}
          />
        ))}
      </View>
    );
  }
}

export default GetServicesData;
