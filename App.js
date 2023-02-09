import { StatusBar } from 'expo-status-bar';
import { Component } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';



const firebase = require('firebase');
require('firebase/firestore');



export default class App extends Component {
  constructor(){
    super();
    this.state= {
      lists: [],
    }



 
  
  if (!firebase.apps.length){
    firebase.initializeApp({
      apiKey: "AIzaSyCk3qKS1maejgngU6rUs7c9AGeKz1SQJOA",
      authDomain: "test-7d828.firebaseapp.com",
      projectId: "test-7d828",
      storageBucket: "test-7d828.appspot.com",
      messagingSenderId: "637915361036",
      appId: "1:637915361036:web:d10d0cbdb13f61e4ca6329"
    });
    }


    this.referenceShoppingLists = firebase
    .firestore()
    .collection('shoppingLists');

}

onCollectionUpdate = (querySnapshot) => {
  const lists = [];
  // go through each document
  querySnapshot.forEach((doc) => {
    // get the QueryDocumentSnapshot's data
    var data = doc.data();
    lists.push({
      name: data.name,
      items: data.items.toString(),
    });
  });
  this.setState({
    lists,
  });
};

componentDidMount() {
  this.referenceShoppingLists = firebase.firestore().collection('shoppingLists');
  this.unsubscribe = this.referenceShoppingLists.onSnapshot(this.onCollectionUpdate)
}

 componentWillUnmount() {
   this.unsubscribe();
}





  render(){
    return (
      <View style={styles.container}>
        
        

        <FlatList
        data={this.state.lists}
         renderItem={({ item }) =>
         <Text>{item.name}: {item.items}</Text>}
        />
        

      </View>
    );
  }

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,     
  },
  item: {
    fontSize: 20,
    color: 'blue',
  },
  text: {
    fontSize: 30,
  }
});
