import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components'
import NHSbar from '../components/NHSbar'
import ProfileBar from '../components/ProfileBar'
import PatientSearch from '../components/PatientSearch'
import MonitoredPatients from '../components/MonitoredPatients'
import {useAuth} from '../utils/auth'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../utils/firebase'

export default function Dashboard(props){
  const [error, setError] = useState('')
  const [doctor, setDoctor] = useState({})
  const {currentUser, logout} = useAuth()
  const navigate = useNavigate()
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

  const getDoctor = async () => {
    const ref = db.collection('Doctors')
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
        <TextLabel>Dialog Diabetic Patient Monitoring - Dashboard</TextLabel>
        <PatientSearch/>
        <MonitoredPatients/>
      </MainContainer>
    </Background>
  )
}


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
