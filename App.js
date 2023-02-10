import { StatusBar } from 'expo-status-bar';
import { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';



const firebase = require('firebase');
require('firebase/firestore');



export default class App extends Component {
  constructor(){
    super();
    this.state= {
      lists: [],
      uid: 0,
      loggedInText: 'Please wait to be logged in',
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


    
this.referenceShoppinglistUser = null;
    

}

componentDidMount() {
  // creating a references to shoppinglists collection
  this.referenceShoppingLists = firebase
  .firestore()
  .collection('shoppingLists');

  // listen to authentication events
  this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      await firebase.auth().signInAnonymously();
    }
  
    //update user state with currently active user data
    this.setState({
      uid: user.uid,
      loggedInText: 'Hello there',
    });
  });

   // create a reference to the active user's documents (shopping lists)
   this.referenceShoppinglistUser = firebase.firestore().collection('shoppingLists').where("uid", "==", this.state.uid);
   // listen for collection changes for current user 
   this.unsubscribeListUser = this.referenceShoppinglistUser.onSnapshot(this.onCollectionUpdate);
}

onCollectionUpdate = (querySnapshot) => {
  const lists = [];
  // go through each document
  querySnapshot.forEach((doc) => {
    // get the QueryDocumentSnapshot's data
    var data = doc.data();
    lists.push({
      name: data.name,
      items: data.item.toString(),
    });
  });
  this.setState({
    lists,
  });
};



addList() {
  this.referenceShoppingLists.add({
    name: 'TestList',
    item: ['eggs', 'pasta', 'veggies'],
    uid: this.state.uid,
  });
}




 componentWillUnmount() {
   // stop listening to authentication
   this.authUnsubscribe();
   // stop listening for changes
   this.unsubscribeListUser();
}






  render(){
    return (
      <View style={styles.container}>
        <Text>{this.state.loggedInText}</Text>
        <Text style={styles.text}>Shopping List</Text>
        <FlatList
        data={this.state.lists}
         renderItem={({ item }) =>
         <Text style={styles.item}>{item.name}: {item.items}</Text>}
        />
        <View style={styles.addButton}>
        <Button 
        title='Add Something'
        onPress={() => {
          this.addList()
        }}
        />
        </View>
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
  },
  addButton: {
    backgroundColor: 'purple',
    marginBottom: 40,
    width: '80%',
    height: '5%',
    alignSelf: 'center',
    position: 'relative',
  },
});
