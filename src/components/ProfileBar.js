import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components"

export default function ProfileBar(props){
  const fname = props.fname;
  const lname = props.lname;
  const [isHovering, setIsHovering] = useState(false)

  return(
    <GreyBar>
      <NameContainer>Dr {fname} {lname}</NameContainer>
      <LogoutText onClick = {props.onLogoutClick}
      onMouseEnter = {()=> setIsHovering(true)}
      onMouseLeave = {() => setIsHovering(false)}
      isHovering = {isHovering}>LOG OUT</LogoutText>
    </GreyBar>
  )
}

const GreyBar = styled.div`
  position: relative;
  display: flex;
  width: 100vw;
  height: 30px;
  justify-content: space-between;
  align-items: center;
  background: #C4C4C4;
`

const NameContainer = styled.div`
  font-size: 15px;
  line-height: 18px;
  margin: 0 90px;
`

const LogoutText = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  font-size: 20px
  font-weight: bold;
  line-height: 18px;
  margin: 0 70px;
  font-weight: bold;
  ${(props) => props.isHovering && 'text-decoration: underline;'}
`
