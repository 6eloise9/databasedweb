import React from "react"
import styled from "styled-components"
import NHSlogo from "../images/NHSLogo.svg"

export default function NHSbar() {
  return(
  <Container>
    <LogoImg src = {NHSlogo} alt = "NHS logo"/>
  </Container>
  )
}

const Container = styled.div`
  height: 80px;
  width:106vw;
  background: #005EB8;
`

const LogoImg = styled.img`
  position: absolute;
  height: 32px;
  width: 76px;
  left: 5%;
  top: 20px;
`
