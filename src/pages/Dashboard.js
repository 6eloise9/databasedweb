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


export default function Dashboard(props){
  const [error, setError] = useState('')
  const [doctor, setDoctor] = useState({})
  const {currentUser, logout} = useAuth()
  const navigate = useNavigate()
  const [storedPatient, selectPatient] = useState()
  const [isPatSelected, setPatSelected] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

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
      }
    })
  }

  useEffect(() => {
  {/* code here will run when page loads*/}
   getDoctor()
  }, [])


  return(

  <Background>
    <NHSbar/>
    <ProfileBar
      fname = {doctor.fName}
      lname = {doctor.lName}
      onLogoutClick = {onLogoutClick}
    />
      <MainContainer>
      <LeftContainer>
        <TextLabel>Dialog - Dashboard</TextLabel>
        <PatientSearch
          returnPatient={(patient) => selectPatientWrap(patient)}
          returnSelected={(isPatSelected) => setPatSelected({isPatSelected})}/>
        <MonitoredPatients/>
      </LeftContainer>
      <RightContainer>

      <PatientViewer selected={isPatSelected} patient={storedPatient}/>
      </RightContainer>
      </MainContainer>
    </Background>
  )
}


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
  justify-content: space-around;
  margin-left: 0.5vw;
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
