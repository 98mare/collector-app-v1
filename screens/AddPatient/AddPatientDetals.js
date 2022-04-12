import { Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Header from '../../components/Header';
import { BottomSheet, Icon, Input } from 'react-native-elements';
import AppButton from '../../components/ui/AppButton';
import CancleBtn from '../../components/ui/CancleBtn';
import MapView from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

const AddPatientDetals = ({ route }) => {
  // console.log("route", route.params.gender);
  const [butDis, setButDis] = useState(false);
  const [PatientFName, setPatientFName] = useState();
  const [PatientMName, setPatientMName] = useState('');
  const [PatientLName, setPatientLName] = useState();
  const [PatientAge, setPatientAge] = useState();
  // const [PatientGender, setPatientGender] = useState();
  const [PatientEmailId, setPatientEmailId] = useState('');
  const [PatientAddress, setPatientAddress] = useState(
    {
      'latitude': 27.7172,
      'longitude': 85.3240,
    }
  );

  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  const [region, setRegion] = useState({
    latitude: 27.7172,
    longitude: 85.3240,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const navigation = useNavigation();


  const validate = () => {
    // Keyboard.dismiss();
    let isOpValid = true
    // const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (PatientFName === '' || PatientFName === undefined) {
      handleError('please enter First Name', 'PatientFName')
      isOpValid = false
    }
    if (PatientLName === '' || PatientLName === undefined) {
      handleError('please enter Last Name', 'PatientLName')
      isOpValid = false
    }
    if (PatientAge === '' || PatientAge === undefined) {
      handleError('please enter Age', 'PatientAge')
      isOpValid = false
    }

    if (PatientEmailId === '' || PatientEmailId === undefined) {
      // isOpValid = true
    } else {
      if (reg.test(PatientEmailId.trim()) === false) {
        handleError('please enter valid email Address', 'PatientEmailId')
        isOpValid = false
      }
    }

    return isOpValid;
  }

  const handleError = (error, input) => {
    setErrors(prevState =>
      ({ ...prevState, [input]: error }));
  };

  const handleAddress = (lat, long) => {
    const temp = {
      'latitude': lat,
      'longitude': long
    }
    setPatientAddress(temp);
    setIsVisible(!isVisible);
  }

  const handleProceed = () => {
    let isValidated = validate();

    let data = {
      "PatientFName": PatientFName,
      "PatientMName": PatientMName !== '' ? PatientMName : '',
      "PatientLName": PatientLName,
      "PatientAge": PatientAge,
      "PatientGender": route.params.gender,
      "PatientEmailId": PatientEmailId !== '' ? PatientEmailId : '',
      "PatientAddress": JSON.stringify(PatientAddress),
    }

    if (isValidated === true) {
      // console.log("data", data , isValidated);
      navigation.navigate('AddRefReq', {
        data: data
        // {
        //   "PatientAddress": "{\"latitude\":27.7172,\"longitude\":85.324}",
        // "\"{\\\"latitude\\\":27.690878787779162,\\\"longitude\\\":85.32818583771586}\"",
        //   "PatientAge": "88",
        //   "PatientEmailId": "",
        //   "PatientFName": "Suman",
        //   "PatientGender": "male",
        //   "PatientLName": "sunuwar",
        //   "PatientMName": "",
        // }
        
      })
    } else {
      Alert.alert(
        "Failure",
        "Please fill up the data.",
        [
          { text: "OK" }
        ]
      );
    }
  }

  return (
    <View style={styles.maincontainer}>
      <Header title={'Add Patient, pateint details'}></Header>
      <View style={styles.container}>

        <Input
          value={PatientFName}
          placeholder='First Name'
          onChangeText={(fname) => setPatientFName(fname)}
          onFocus={() => handleError(null, 'PatientFName')}
          label="First Name"
          errorMessage={errors.PatientFName}
        />

        <Input
          value={PatientMName}
          placeholder='Middle Name'
          onChangeText={(mname) => setPatientMName(mname)}
          onFocus={() => handleError(null, 'PatientMName')}
          label="Middle Name"
          errorMessage={errors.PatientMName}
        />

        <Input
          value={PatientLName}
          placeholder='Last Name'
          onChangeText={(lname) => setPatientLName(lname)}
          onFocus={() => handleError(null, 'PatientLName')}
          label="Last Name"
          errorMessage={errors.PatientLName}
        />


        <Input
          value={PatientAge}
          placeholder='Age'
          onChangeText={(e) => setPatientAge(e)}
          keyboardType='number-pad'
          onFocus={() => handleError(null, 'PatientAge')}
          label="Age"
          errorMessage={errors.PatientAge}
        />

        <Input
          value={PatientEmailId}
          placeholder='email'
          onChangeText={(email) => setPatientEmailId(email.trim())}
          onFocus={() => handleError(null, 'PatientEmailId')}
          label="email"
          errorMessage={errors.PatientEmailId}
        />
        <View style={styles.TextInput}>
          <Text style={styles.cLabel}>Address</Text>
          <TouchableOpacity style={styles.inputField} onPress={() => setIsVisible(true)} >
            <View style={{
              flexDirection: 'row'
            }}>
              <Text>{JSON.stringify(region.latitude)}, </Text>
              <Text>{JSON.stringify(region.longitude)}</Text>
            </View>
            <Icon
              name='location-pin'
              color={'#FF7F00'}
              type='entypo'
              style={styles.icon}
            ></Icon>
          </TouchableOpacity>
        </View>



        <BottomSheet modalProps={{}} isVisible={isVisible}>
          <View style={{ flex: 1 }}>
            <MapView
              style={styles.map}
              initialRegion={{
                // latitude: geolocation.latitude === null ? 27.7172 : geolocation.latitude,
                // longitude: geolocation.longitude === null ? 85.3240 : geolocation.longitude,
                latitude: 27.7172,
                longitude: 85.3240,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onRegionChangeComplete={(region) => setRegion(region)}
            >
              {/* {console.log(region)} */}
            </MapView>
            <View style={styles.cMarker}>
              <Image
                source={require('../../assets/images/collector.png')}
                style={styles.cMarkerImg}
              ></Image>
            </View>
            <View
              style={styles.bSheet}
            >
              {/* <Button title='cancle' onPress={() => setIsVisible(false)} color={'#ffc107'} buttonStyle={{ backgroundColor: 'yellow' }} /> */}
              <CancleBtn title='cancle' onPress={() => setIsVisible(false)}></CancleBtn>
              {/* <View>
                  <Text>latitude:{JSON.stringify(region.latitude)}</Text>
                  <Text>longitude:{JSON.stringify(region.longitude)}</Text>
                </View> */}
              <AppButton title='save' onPress={() => handleAddress(region.latitude, region.longitude)} ></AppButton>
              {/* <Button title='save' onPress={() => handleAddress(region.latitude, region.longitude)} /> */}
            </View>

          </View>

        </BottomSheet>
        <AppButton
          title='Submit'
          onPress={handleProceed}
          disabled={butDis}
        ></AppButton>

      </View>

    </View>
  )
}

export default AddPatientDetals

const styles = StyleSheet.create({
  maincontainer: {
    backgroundColor: '#fefefe',
    flexDirection: 'column',
  },
  container: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
    height: Dimensions.get('window').height,
    backgroundColor: '#fefefe',
    paddingTop: 20,
    paddingBottom: 50,
  },

  TextInput: {
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#4c4747',
    // backgroundColor: '#fefefe',
    width: Dimensions.get('window').width * 1,

  },
  inputField: {
    width: Dimensions.get('window').width - 20,
    // borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fefefe',
    borderBottomColor: '#95957abd',
    // paddingHorizontal: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden'
  },

  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  bSheet: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    // height: 100,
    backgroundColor: '#fefefe',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
  },
  cMarker: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'

  },
  cMarkerImg: {
    width: 20,
    resizeMode: 'contain',
  },
})