import { Button, Dimensions, StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Pressable, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import AppButton from './AppButton';
import CancleBtn from './CancleBtn';
import { useDispatch, useSelector } from 'react-redux';
import { GetHomeCollectionTestRequestTestList, UpdateStatus } from '../../Services/appServices/AssignPatient';
import StatusBadge from './StatusBadge';
import MapView from 'react-native-maps';
import MarkerCostome from './MarkerCostome';
import { Icon } from 'react-native-elements';



const windowWidth = Dimensions.get('window').width

// "SrId": 1,
//  "RequestId": 2,
//  "RequestStatusId": 3,
//  "EntryDate": "2022-03-22T10:57:37.8717928+05:45",
//  "UserId": 5,
//  "Remarks": "sample string 6"


// "CollectedDate": "2022-04-03T17:15:03",
// "CollectionCharge": 500,
// "CollectionReqDate": "2022-04-16T17:13:44",
// "CollectorId": 3,
// "DiscountAmount": 100,
// "GrandTotal": 6215,
// "IsPaid": true,
// "PatId": 66,
// "PatientAge": "26",
// "PatientFName": "Ram",
// "PatientGender": "male",
// "PatientLName": "Yadav",
// "PatientMName": "",
// "RId": 44,
// "Remarks": "Sik free",
// "RequestStatus": "Requested",
// "TestTotalAmount": 5815,


const TaskCard = ({ data }) => {
  // console.log('data', data);
  const [isVisibe, setisVisibe] = useState(false);
  const [isRemarksVisible, setisRemarksVisible] = useState(false);
  const [Remarks, setRemarks] = useState('');
  const user = useSelector(state => state.storeUserData);
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const text = data.CollectionReqDate;
  const temp = text.split('T');
  const [TestList, setTestList] = useState();

  useEffect(() => {
    dispatch(GetHomeCollectionTestRequestTestList(data.RId, (res) => {
      setTestList(res?.RequestTestList);
    }))
    // dispatch(GetStatus((res) => {
    //   setCollectedStatus(res.sampleStatus[4]);
    // }))
  }, [])


  const hadleEvent = () => {
    setisVisibe(true)

  }

  const handleAccept = () => {
    // UpdateStatus
    let today = new Date();
    const newDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + 'T' + today.toLocaleTimeString();
    const rData = {
      "SrId": 0,
      "RequestId": data.RId,
      "RequestStatusId": 3,
      //  "RequestStatusId": 1,
      "EntryDate": newDate,
      "UserId": user.userData.usrUserId,
      "Remarks": `accepted by user ${user.userData.usrUserId}`,
    }
    console.log('accepted data', rData);
    dispatch(UpdateStatus(rData, (res) => {
      // console.log('response', res);
      if (res?.SuccessMsg === true) {
        // console.log('potato sucess');
        setisVisibe(false);
        navigation.navigate('AcceptedTask');

      }
    }))

  }

  const handleReject = () => {
    // UpdateStatus
    let today = new Date();
    const newDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + 'T' + today.toLocaleTimeString();
    const aData = {
      "SrId": 0,
      "RequestId": data.RId,
      "RequestStatusId": 4,
      "EntryDate": newDate,
      "UserId": user.userData.usrUserId,
      "Remarks": Remarks !== '' ? Remarks : '',
    }
    console.log('rejected data', aData);
    dispatch(UpdateStatus(aData, (res) => {
      console.log('response', res);
      if (res?.SuccessMsg === true) {
        console.log('potato sucess, rejected');
        setisVisibe(!isVisibe)
        setisRemarksVisible(false)
        setRemarks('')
      }
    }))

  }

  const cMarker = {
    latlng: {
      // latitude: tempCoordinate.latitude === null ? 27.7172 : tempCoordinate.latitude,
      // longitude: tempCoordinate.longitude === null ? 85.3240 : tempCoordinate.longitude
      latitude: 27.7172,
      longitude: 85.3240,
    },
    title: 'title',
    description: 'somethindg'
  }
  return (
    <>
      <Pressable onPress={() => hadleEvent()} style={styles.cardCotainer}>
        <View style={styles.cardBody}>
          <View style={styles.card}>
            <Text style={styles.ctitle}>{data.PatientFName} {data.PatientLName}</Text>
            <Text style={styles.remarks}>Request Id: {data.RId}</Text>
            <Text style={styles.cDate}>{data.CollectionReqDate}</Text>
          </View>
          <View>
            {
              (data.RequestStatus === 'Requested' || data.RequestStatus === 'Asigned') ?
                <Text style={[styles.badge]}>pending</Text> : null
            }
            {
              (data.RequestStatus === 'Collected') ?
                <Text style={[styles.badge]}>{data.RequestStatus}</Text> : null
            }
            {
              (data.RequestStatus === 'Accepted') ?
                <View>
                  <Text style={[styles.badge]}>pending</Text>
                  <Text style={[styles.badge, { backgroundColor: '#aeee19' }]}>{data.RequestStatus}</Text>
                </View>
                : null
            }
            {
              (data.RequestStatus === 'Rejected') ?
                <Text style={[styles.badge, { backgroundColor: '#e43333' }]}>{data.RequestStatus}</Text> : null
            }
            {
              (data.RequestStatus === 'Lab Received') ?
                <Text style={[styles.badge, { backgroundColor: '#33e4af' }]}>{data.RequestStatus}</Text> : null
            }
            {
              (data.RequestStatus === 'Report Dispatched') ?
                <Text style={[styles.badge, { backgroundColor: '#33bbe4' }]}>{data.RequestStatus}</Text> : null
            }

          </View>
        </View>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisibe}
        onRequestClose={() => {
          setisVisibe(!isVisibe)
          setisRemarksVisible(false)
        }}
      >

        <View style={styles.centeredView}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: '#8ED1FC',
              padding: 10,
              borderRadius: 50,
            }}
            onPress={() => {
              setisVisibe(false)
              setisRemarksVisible(false)
            }}>
            <Icon
              name={'close'}
              color={'#fefefe'}
              type='antdesign'
              size={20}
            ></Icon>
          </TouchableOpacity>
          {
            isRemarksVisible ?
              <View style={styles.textInput}>
                <Text style={styles.formLabel}>Please write remarks on why you want to decline</Text>
                <TextInput
                  value={Remarks}
                  placeholder='Remarks'
                  onChangeText={(e) => setRemarks(e)}
                  style={styles.inputField}
                  multiline={true}
                ></TextInput>

                <AppButton title='Send' onPress={() => handleReject()}></AppButton>
              </View>

              :
              <View style={styles.patInfocontainer}>
                <View style={styles.profile}>
                  <Image
                    source={require('../../assets/images/user.png')}
                    style={styles.profileImg}
                  ></Image>
                  <View style={styles.right}>
                    <Text style={styles.name}>{data.PatientFName} {data.PatientMName} {data.PatientLName}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Text >Request ID :</Text>
                      <Text style={{ color: "#FF7F00" }}> {data.RId}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text >Cliet ID : </Text>
                      <Text style={{ color: "#FF7F00" }}>{data.PatId}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text >Collection Date : </Text>
                      <Text style={{ color: "#FF7F00" }}>{temp[0]}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text >Collection Time : </Text>
                      <Text style={{ color: "#FF7F00" }}>{temp[1]}</Text>
                    </View>
                  </View>

                </View>

                <View style={styles.statusCotnainer}>
                  <StatusBadge data={data.RequestStatus}></StatusBadge>
                  <StatusBadge data={'Collected'}></StatusBadge>
                  <StatusBadge data={'Lab Received'}></StatusBadge>
                  <StatusBadge data={'Report Dispatched'}></StatusBadge>
                </View>

                <View style={styles.mapViewContainer}>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: 27.7172,
                      longitude: 85.3240,
                      latitudeDelta: 0.0111922,
                      longitudeDelta: 0.0111421,
                    }}
                  >
                    <MarkerCostome
                      coordinate={cMarker.latlng}
                      title={cMarker.title}
                      description={cMarker.description}
                      forClient
                    />
                  </MapView>
                </View>

                <View style={styles.flatListContainer}>
                  <Text style={styles.title}>Tests</Text>
                  <FlatList
                    data={TestList}
                    renderItem={({ item, index }) =>
                      <View style={styles.testCard}>
                        <Text style={{
                          fontSize: 16,
                          color: '#fefefe',
                          width: 25,
                          height: 25,
                          textAlign: 'center',
                          borderRadius: 50,
                          backgroundColor: '#205072',
                        }}>{index + 1}</Text>
                        <Text style={styles.testsText}>{item.TestName}</Text>
                        <Text style={styles.testsPrice}>Rs.{item.TestPrice}</Text>
                      </View>
                    }
                    keyExtractor={item => item.SId}
                  />
                </View>

                <View style={styles.module}>

                  <CancleBtn title='Reject' color={'#e0c945'} onPress={() => setisRemarksVisible(true)}></CancleBtn>
                  <Text>   </Text>
                  <AppButton title='Accept' onPress={() => handleAccept()}></AppButton>
                </View>

              </View>

          }
        </View>
      </Modal>

    </>
  )
}

export default TaskCard

const styles = StyleSheet.create({
  cardCotainer: {
    width: windowWidth,
    paddingHorizontal: 10,
  },
  cardBody: {
    backgroundColor: "#fefefe",
    marginVertical: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#205072',
    shadowColor: "#101010",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  ctitle: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 2,
    color: "#205072",
    marginBottom: 5,
  },
  remarks: {
    color: "#253539",
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: 5,
  },
  cDate: {
    color: "#fefefe",
    fontSize: 10,
    letterSpacing: 2,
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: "#ff7f00",
    borderRadius: 10,
    width: 'auto'
  },
  centeredView: {
    width: '100%',
    // height: "100%",
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fefefe'
  },
  textInput: {
    width: "100%",
    flex: 1,
    marginLeft: 10,
    // backgroundColor: 'red',
    justifyContent: 'center',
    // alignItems: 'center'
  },
  module: {
    width: '100%',
    // height: 200,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  inputField: {
    borderWidth: 1,
    borderColor: 'red',
    width: windowWidth - 20,
    minHeight: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginVertical: 10,
  },

  // badges 
  badge: {
    backgroundColor: '#f3ff49',
    color: '#fefefe',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 20,
    fontSize: 10,
    marginVertical: 2,
  },


  patInfocontainer: {
    width: windowWidth - 20,
    flex: 1,
    marginLeft: 10,
    // backgroundColor: 'red'
  },

  profile: {
    // flex: 1,
    flexDirection: 'row',
    // padding: 10,
    paddingVertical: 10,
  },
  right: {
    marginLeft: 20,
  },
  profileImg: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  name: {
    width: windowWidth * 0.5,
    color: '#205072',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.3,
    marginBottom: 6
  },
  statusCotnainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mapViewContainer: {
    width: '100%',
    flex: 0.4,
    // backgroundColor: 'red',
    borderRadius: 18,
    marginVertical: 10,
    overflow: 'hidden'
  },
  map: {
    width: '100%',
    flex: 1,
  },
  flatListContainer: {
    width: windowWidth - 20,
    marginHorizontal: 10,
    flex: 0.55,
  },
  title: {
    fontSize: 20,
    color: '#205072',
    fontWeight: 'bold',
    letterSpacing: 1.3,
    marginBottom: 10
  },
  testCard: {
    flexDirection: 'row',
    marginVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 5,
    width: '100%',
  },
  testsText: {
    color: "#232325",
    fontSize: 14,
    letterSpacing: 1.2,
    marginLeft: 20,
    width: windowWidth * 0.6
  },
  testsPrice: {
    width: windowWidth * 0.4,
    color: '#FF7F00'
  },

})