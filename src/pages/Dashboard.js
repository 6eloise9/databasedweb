import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components'
import NHSbar from '../components/NHSbar'
import ProfileBar from '../components/ProfileBar'
import PatientSearch from '../components/PatientSearch'
import MonitoredPatients from '../components/MonitoredPatients'
import PatientViewer from '../components/PatientViewer';
import {useAuth} from '../utils/auth'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../utils/firebase'
import { collection, query, where, getDocs} from "firebase/firestore"


export default function Dashboard(props){
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [doctor, setDoctor] = useState({})
  const [doctorDocReference, setDoctorDocReference] = useState()
  const {currentUser, logout} = useAuth()
  const navigate = useNavigate()
  const [storedPatient, selectPatient] = useState()
  const [isPatSelected, setPatSelected] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [monitoredPatientNums, setMonitoredPatientNums] = useState([])
  const [monitoredPatients, setMonitoredPatients] = useState([])


  const onLogoutClick = async () => {
    setError('')
    try{
      await logout()
      navigate('/login')
    } catch {
      setError('failed to log out - contact IT')
    }
  }


  function selectPatientWrap(patient){
      console.log("Wrapper is called")
      console.log(patient.fName)
      selectPatient(patient)
  }



  const getDoctor = async () => {
    const ref = db.collection('Doctors')
    console.log(auth.currentUser.uid)
    const queryRef = await ref.where('UID', '==', auth.currentUser.uid).limit(1).get().then(query => {
      const drDoc = query.docs[0]
      const drData = drDoc.data()
      if((drData.lName != null) || (drData.fName != null)){
        setDoctor(drData)
        setDoctorDocReference(drDoc)
      }
    })
  }

  useEffect(() => {
  {/* code here will run when page loads*/}
   getDoctor()

   initializeLists()


   async function initializeLists(){

   const cRef = collection(db, 'Doctors')
   console.log("Query")
   const qRef =  query(cRef, where("UID","==",auth.currentUser.uid))
   const qSnap = await getDocs(qRef)
   console.log(qSnap.docs[0].get("Following"))
   const monitoredNums = qSnap.docs[0].get("Following")

   console.log("Query")
   if(monitoredNums.length != 0){
   const cRef = collection(db, "TestPat")
   const qRef = query(cRef, where("NHSNumber", "in", monitoredNums))
   const qSnap = await getDocs(qRef)
   var i =0
   var array = []
   qSnap.forEach(item =>{
     array[i] = item.data()
     i++
   })
   setMonitoredPatients(array)
 }
 else{
   setMonitoredPatients([])
 }
 setMonitoredPatientNums(monitoredNums)
 console.log(monitoredPatientNums)
 console.log(monitoredPatients)
 setIsLoading(false)
  }
  }, [])


  return(

  <Background>
    <NHSbar/>
    <ProfileBar
      fname = {doctor.fName}
      lname = {doctor.lName}
      onLogoutClick = {onLogoutClick}
    />
      {!isLoading &&
      <MainContainer>
        <LeftContainer>

          <TextLabel>Dialog Diabetic Patient Monitoring - Dashboard</TextLabel>

          <PatientSearch
            returnPatient={(patient) => selectPatientWrap(patient)}
            returnSelected={(isPatSelected) => setPatSelected({isPatSelected})}
            returnMonitoredPatients={(patients => setMonitoredPatients(patients))}
            returnMonitoredPatientNums={(patientNums) => setMonitoredPatientNums(patientNums)}
            monitoredPatients={monitoredPatients}
            monitoredPatientNums={monitoredPatientNums}/>


          <MonitoredPatients
          returnMonitoredPatients={(patients => setMonitoredPatients(patients))}
          returnMonitoredPatientNums={(patientNums) => setMonitoredPatientNums(patientNums)}
          monitoredPatients={monitoredPatients}
          monitoredPatientNums={monitoredPatientNums}
          returnPatient={(patient) => selectPatientWrap(patient)}
          returnSelected={(isPatSelected) => setPatSelected({isPatSelected})}
          drRef = {doctorDocReference}/>

        </LeftContainer>

        <RightContainer>
         <PatientViewer  selected={isPatSelected} patient={storedPatient}/>
        </RightContainer>
      </MainContainer>}
    </Background>
  )
}

{/*
const Background = styled.div`
  position: flex;
  flex-direction: column;
`
const TextLabel = styled.div`
  position: relative;
  font-size: 30px;
  color:black;
  text-align: left;
  top: 50px;
  margin-bottom: 100px;
`
const MainContainer = styled.div`
  display: flex;
  flex-direction:column;
  justify-content: space-around;
  margin-left: 60px;
`

const Spacer = styled.div`
  position: relative;
  display: flex;
  width: 1000px;
  height: 30px;
  background: #FFFFFF;

`
*/}

const Background = styled.div`
  position: flex;
  justify-content: flex-start;
`
const TextLabel = styled.div`
  position: relative;
  font-size: 30px;
  color:black;
  text-align: left;
  top: 30px;
  margin-bottom: 6vh;

`
const LeftContainer = styled.div`
  display: flex;
  flex-direction:column;

  margin-left: 3vw;
`
const MainContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-left: 60px;
`
const RightContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction:column;
  justify-content: space-around;
  margin-left: 1vw;
`
const Spacer = styled.div`
  position: relative;
  display: flex;
  width: 1000px;
  height: 30px;
  background: #FFFFFF;

`
