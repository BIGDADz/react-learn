import { observable, action } from 'mobx';
import SignIn from '../components/SignIn';

import firebase from 'firebase/app';
import 'firebase/auth';
// import 'firebase/database';
import 'firebase/firestore';

class AuthStore {
  @observable email = '';
  @observable password = '';
  @observable currentUser = null;
  @observable userInfo = null;
  @observable filePaths = [];

  @action initializeStore() {
    var config = {
      apiKey: "AIzaSyC3VUQ1IEZ-7zczU-m4YXRMJrBNK6XpAzU",
      authDomain: "bigdad-react-learn.firebaseapp.com",
      databaseURL: "https://bigdad-react-learn.firebaseio.com",
      projectId: "bigdad-react-learn",
      storageBucket: "bigdad-react-learn.appspot.com",
      messagingSenderId: "854364423895"
    }
    firebase.initializeApp(config);
    return firebase
  }

  @action setEmail(email) {
    this.email = email;
  }

  @action setPassword(password) {
    this.password = password;
  }

  @action setCurrentUser(currentUser) {
    this.currentUser = currentUser;
  }

  @action async signIn() {
    return firebase.auth().signInWithEmailAndPassword(this.email, this.password).catch(function (error) {
      console.log(error);
      var errorCode = error.code;
      var errorMessage = error.message;
    })
  }

  @action async signUp() {
    return firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
    .then((res) => this.writeUserData(res.user) )
    .catch(function (error) {
      console.log(error);
      var errorCode = error.code;
      var errorMessage = error.message;
    })
  }

  @action signOut() {
    return firebase.auth().signOut()
  }

  @action savePathFile(path) {
    var db = firebase.firestore()
    db.collection("users").doc(this.currentUser.uid).update({
      filePaths: firebase.firestore.FieldValue.arrayUnion(path)
    }).then((docRef) => this.filePaths.push(path))
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
  }

  writeUserData(user) {
    var db = firebase.firestore()
    db.collection("users").doc(user.uid).set({
      email: user.email,
    }).then(function (docRef) {
      console.log("Document written with ID: ", docRef);
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
  }
}

export default new AuthStore();