import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components"
import { db } from '../utils/firebase'

export default function PatientSearch({returnPatient, returnSelected}){
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState()
  const [isPatientSelected, patientSelected] = useState(false)
  const [input, setInput] = useState('');
  const [patientDisplay, setPatientDisplay]=useState(["","","","","",""])
 
  const fetch = async () => {
    {/*fetches data from database*/}
    const patientsRef = await db.collection('TestPat')
    patientsRef.onSnapshot(snapshot => {
      setPatients(snapshot.docs.map(doc => doc.data()))
    })
  }

  useEffect(() => {
  {/* code here will run when page loads*/}
   fetch();
  }, [])


  const handleChange = async (e) => {
    const searchseq = e.target.value
    const newPat = patients.filter((value) => {
      return value.NHSNumber.includes(searchseq)
    })
    setFilteredPatients(newPat)

    console.log('changed!')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const searchseq = e.target.value
  }

  async function handleResultsClick(value){
    const temp = patientDisplay
    temp[0] = value.NHSNumber
    temp[1] = value.fName
    temp[2] = value.lName
    temp[3] = value.DiabetesType
    temp[4] = value.DoctorEmail
    setPatientDisplay(temp)
    patientSelected(true)
    console.log(value)
    returnPatient(value)
    returnSelected(true)
  }


  return(
    <MainContainer>

      <LeftContainer>
        <Title>Search For Patient</Title>

        <form action="/" method="get">
          <SearchText>Search by NHS number</SearchText>
          <Input
           type="text"
           placeholder="NHS number (start typing)"
           onChange = {handleChange}
          />

       </form>

      </LeftContainer>

      <RightContainer>
        <SearchText>Search Results</SearchText>
        <ResultBox>
        {filteredPatients.length != 0 && filteredPatients.map((value,key) => {

          return (<ResultItem onClick={() => {handleResultsClick(value); setSelectedPatient(value)}}>{value.fName} {value.lName}</ResultItem>)

        })}
        </ResultBox>
      </RightContainer>
      <InfoContainer>
        <Title>Selected Patient: {patientDisplay[0]}</Title>
        <TextLabel>First Name: {patientDisplay[1]}</TextLabel>
        <TextLabel>Last Name: {patientDisplay[2]}</TextLabel>
        <TextLabel>Diabetes Type: {patientDisplay[3]}</TextLabel>
        <TextLabel>General Doctor: {patientDisplay[4]}</TextLabel>
        <MonitorButton 
        hidden={!isPatientSelected}>Track Patient</MonitorButton>
        <MonitorButton
        hidden={!isPatientSelected}>View Patient</MonitorButton>
      </InfoContainer>
    </MainContainer>
  )
}


const MainContainer = styled.div`
  position: relative;
  display: flex;
  width: 1000px;
  height: 315px;
  background: #C4C4C4;

`

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  margin: 20px;
`

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  width: 300px;
  margin: 20px;
  padding: 13px;
`

const Title = styled.div`
position: relative;
font-size: 20px;
color:black;
text-align: left;
margin-bottom: 10px;
`
const Input = styled.input`
  width: 100%;
  height: 30px;
  color: #000000;
  border: 0;
  line-height: 120%;
  font-size: 20px;
  margin-bottom: 10px;
  margin-top: 4px;
  padding: 0 10px;
`

const SearchText = styled.div`
  position: relative;
  font-size: 15px;
  color:black;
  text-align: left;
  font-weight: bold;
  margin-bottom: 5px;
`


const ResultItem = styled.div`

  text-align: left;
  margin: 5px 0;
  font-size: 15px;
  cursor: pointer;
  .selected {
    background: #005EB890;
    text-color: white;
    border: 1px dashed black;
  }
  &:hover{
    background: #005EB890
  }
`

const ResultBox = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 100%

`

const MonitorButton = styled.button`
  height: 40px;
  width: 50%;
  background: #005EB890;
  border: 2px solid black;
  text-decoration: none;
  text-color: white;
  margin-top: 5px;
  cursor: pointer;
`
const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  width: 300px;
  margin: 20px;
  padding: 13px;
`

const TextLabel = styled.div`
  position: top;
  font-size: 15px;
  color:black;
  text-align: left;
  top: 50px;
`

{/*
patients && patients.map(patient =>{
  return(
    <p>{patient.fName}</p>
  )
})
*/}
