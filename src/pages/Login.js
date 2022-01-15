import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components"
import NHSbar from "../components/NHSbar"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'
import { auth, db } from '../utils/firebase'
import {collection,query, where, getDocs} from "firebase/firestore"
import "firebase/compat/auth"

export default function Login() {
  const emailInput  = useRef()
  const passwordInput = useRef()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [isHovering, setIsHovering] = useState(false)



  {/*From "React Authentication Crash COurse with Firebase and Routing:"*/}
  const onSubmitClick = async (event) => {
    event.preventDefault()
    try{
      setError('')
      setIsLoading(true)

      if(auth.currentUser==null){
        auth.signOut()
      }

     await login(emailInput.current.value, passwordInput.current.value)

     {/*checking auth is dr before they are routed to dashboard*/}
     const querySnap = await getDocs(query(collection(db,"Doctors"), where("UID", "==", auth.currentUser.uid)))
     if(querySnap.empty){
       throw "Not a Doctor"
     }

      navigate('/')
    } catch (e) {
      console.log(e)
        setError("Login failed - please check credentials")
    }
    setIsLoading(false)
  }



  return (
    <Background>
      <NHSbar />
      <MainContainer>
        <TextLabel>Dialog Diabetic Patient Monitoring - Staff Login</TextLabel>
        {error && <Error>{error}</Error>}

        <Form>
          {/* EMAIL */}
          <InputContainer>
            <Input
              placeholder= 'email'
              type = 'text'
              ref = {emailInput}
              required
            />
          </InputContainer>
          {/* PASSWORD */}
          <InputContainer>
            <Input
              placeholder='password'
              type = 'password'
              ref = {passwordInput}
              required
            />
            <SubmitButton
            onMouseEnter = {()=> setIsHovering(true)}
            onMouseLeave = {() => setIsHovering(false)}
            isHovering = {isHovering}
            disabled = {isLoading}
            type = "submit"
            onClick = {onSubmitClick}>
            Log in
            </SubmitButton>
          </InputContainer>
        </Form>
      </MainContainer>
    </Background>
  )
}




const Background = styled.div`
  position: flex;
  flex-direction: column;
`
const MainContainer = styled.div`
  position: flex;
  flex-direction:column;
  margin-left: 100px;
`
const InputContainer = styled.form`
  position: relative;
  padding: 0 20px;
  top: 150px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  width: 30em;
  background:#ffffff;
  border-radius: 8px;
  margin-bottom: 17px;

`

const Input = styled.input`
  width: 100%;
  height: 40px;
  font-size: 10px;
  color: #000000;
  border: 0;
  line-height: 120%;
  font-size: 20px;
  outline: 2px solid black;
  border-radius:10px;
  margin-bottom: 10px;
  padding: 0 10px;
`

const SubmitButton = styled.button`
  margin-top: 30px;
  background: #005EB8;
  color: white;
  border: none;
  text-decoration: none;
  border-radius: 10px;
  cursor: pointer;
  width:100px;
  height: 30px;
  ${(props) => props.isHovering && 'background: #0D318D;'}
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
`
const TextLabel = styled.div`
  position: relative;
  font-size: 35px;
  color:black;
  text-align: left;
  top: 50px;
`
const Error = styled.div`
  position: relative;
  background #FF000090 ;
  width: 400px;
  height: 30px;
  top: 120px;
  left: 20px;
  border-radius: 10px;
  color: white;
  text-align: center;
  font-size: 20px;
`
