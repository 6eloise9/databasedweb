import React from "react"
import styled from "styled-components"
import NHSbar from "../components/NHSbar"

export default function Login() {
  const onClick = null
  const onPasswordButtonClick = null
  return (
    <Background>
      <NHSbar />
      <MainContainer>
        <TextLabel>Dialog Diabetes Monitoring - Login</TextLabel>
        <Form>
          {/* EMAIL */}
          <InputContainer>
            <Input
              placeholder='email'
              type = 'text'
            />
          </InputContainer>
          {/* PASSWORD */}
          <InputContainer>
            <Input
              placeholder='password'
              type = 'password'
            />
            <SubmitButton
              onClick={onPasswordButtonClick}
            >Log in</SubmitButton>
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
  width:100px;
  height: 30px;
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
