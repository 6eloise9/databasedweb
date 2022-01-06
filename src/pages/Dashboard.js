import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components"
import NHSbar from "../components/NHSbar"
import ProfileBar from "../components/ProfileBar"
import {useAuth} from '../utils/auth'
import { useNavigate } from 'react-router-dom'

export default function Dashboard(){
  const[error, setError] = useState('')
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

  return(

  <Background>
    <NHSbar/>
    <ProfileBar
      fname = "Nettles"
      lname = "Holloway"
      onLogoutClick = {onLogoutClick}
    />
      <MainContainer>

        <TextLabel>Dialog Diabetic Patient Monitoring - Dashboard</TextLabel>
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
  font-size: 35px;
  color:black;
  text-align: left;
  top: 50px;
`
const MainContainer = styled.div`
  position: flex;
  flex-direction:column;
  margin-left: 85px;
`