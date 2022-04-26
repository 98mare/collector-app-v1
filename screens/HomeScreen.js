import { Dimensions, FlatList, Image, ImageBackground, Linking, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { Avatar, Icon } from 'react-native-elements';
import { GlobalStyles } from '../GlobalStyle';
import { HomeActionButton } from '../components/ui/HomeActionButton';
// import GreetingCard from '../components/ui/GreetingCard'
// import CardButton from '../components/ui/CardButton'
import * as Location from "expo-location"

import { Alert, Platform } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { UpdateCollectorLocation } from '../Services/appServices/Collector';
import HamMenu from '../components/ui/HamMenu';
import Header from '../components/Header';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import NotificationBtn from '../components/ui/NotificationBtn';






const windowWidth = Dimensions.get('window').width;
const HomeScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.storeUserData);
  // console.log(user.userData.usrrole);
  const dispatch = useDispatch();

  
  const navData = [
    {
      id: 1,
      name: 'Add Patient',
      pathName: 'AddPatient',
      color: '#9985FF',
      icon: 'addusergroup',
      type: 'antdesign',
      isAdmin: true,
      isCollecor: true,
    },
    {
      id: 2,
      name: 'Patient',
      pathName: 'BookTest',
      color: '#FF8585',
      icon: 'user',
      type: 'antdesign',
      isAdmin: true,
      isCollecor: true,
    },
    {
      id: 3,
      name: 'Sample',
      pathName: 'SampleHome',
      color: '#FFC285',
      icon: 'test-tube-alt',
      type: 'fontisto',
      isAdmin: true,
      isCollecor: true,
    },
    {
      id: 4,
      name: 'Task',
      pathName: 'task',
      color: '#4688B3',
      icon: 'notification',
      type: 'entypo',
      isAdmin: false,
      isCollecor: true,
    },
    {
      id: 4,
      name: 'Collector Tracking',
      pathName: 'CollectorLocation',
      color: '#4688B3',
      icon: 'find',
      type: 'antdesign',
      isAdmin: true,
      isCollecor: false,
    },
  ]


  const renderItem = ({ item }) => (
    <HomeActionButton data={item} />
  )

  

  return (
    <View style={styles.maincontainer}>
      <ImageBackground
        source={require('../assets/images/bkg2.png')}
        resizeMode="cover"
        style={styles.bkgImg}
      >
        <View style={styles.hamMenu}>
          {/* <HamMenu></HamMenu> */}
          <NotificationBtn></NotificationBtn>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.dis}>
            <Text style={[GlobalStyles.body, { color: '#3d4e58' }]}>Hi!</Text>
            <Text style={[GlobalStyles.header, { color: '#205072' }]}>Admin</Text>
            <Text style={[GlobalStyles.body, { color: '#3d4e58' }]}>Your target for today is to keep positive mindset and smile to everyone you meet.</Text>
          </View>
          {/* <Avatar
            size={64}
            rounded
            source={require('../assets/images/user.png')}
          /> */}
        </View>
        
        <FlatList
          data={navData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          style={styles.flatContainer}
        />
      </ImageBackground>
    </View>
  )
}

export default HomeScreen



const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    // backgroundColor: '#f9f9f9'
  },
  bkgImg: {
    flex: 1,
    paddingTop: 40,
  },
  cardContainer: {
    flexDirection: 'row',
    width: windowWidth - 20,
    justifyContent: 'space-between',
    backgroundColor: global.primaryBkg,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginHorizontal: 10,
    marginTop: 40,
    shadowColor: "#86a3a3",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 15,
  },
  dis: {
    // width: windowWidth * 0.65,
  },
  flatContainer: {
    // width: windowWidth - 20,
    // marginHorizontal: 10,
    paddingVertical: 15,
  },
  hamMenu: {
    width: windowWidth,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginHorizontal: 10
  }
})