import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components"
import { auth, db } from '../utils/firebase'
import "firebase/compat/auth"
import { arrayRemove, updateDoc, doc } from "firebase/firestore";

export default function MonitoredPatients({monitoredPatients, returnMonitoredPatients, monitoredPatientNums, returnMonitoredPatientNums, returnPatient, returnSelected, drRef}){
  const [selectedPatient, setSelectedPatient] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [isFiltering, setIsFiltering] = useState(false)


  useEffect(() => {
  {/* code here will run when page loads and whenever state of monitored patients changes*/}
  },[])



  
  async function onPatientClick(value){
    const temp = value
    setSelectedPatient(temp)
  }

  const searchFilter = async (e) => {
    const searchseq = e.target.value.toLowerCase()
    const newPat = monitoredPatients.filter((value) => {
      const fullName = value.fName + value.lName
      return fullName.toLowerCase().includes(searchseq)
    })
    setFilteredPatients(newPat)
    setIsFiltering(true)
  }

  function handleUnmonitorClick(){
      const patDocRef = doc(db, "TestPat", selectedPatient.NHSNumber.trim())

      updateDoc(patDocRef, {
        Alerts: arrayRemove(drRef.get("email"))
      })

      updateDoc(drRef.ref, {
        Following: arrayRemove(selectedPatient.NHSNumber)
      })

      var newNums = monitoredPatientNums.filter(function(value, index, arr){
        return value != selectedPatient.NHSNumber
      })

      var newPats = monitoredPatients.filter(function(value, index, arr){
        return value.NHSNumber != selectedPatient.NHSNumber
      })

      console.log(newPats)
      console.log(newNums)
      returnMonitoredPatients(newPats)
      returnMonitoredPatientNums(newNums)
      setSelectedPatient(newPats[0])
  }

  function handleViewClick(){
      if(selectedPatient !=null){
        returnSelected(true)
        returnPatient(selectedPatient)
      }
  }

  return(
    <Card>
      <Container>
        <Title>Patients you are monitoring</Title>
        <WhiteContainer>
        <Form action="/" method="get">
          <Text>Search by name</Text>
          <Input
           type="text"
           placeholder="Patient Name"
           onChange = {searchFilter}
          />
       </Form>
          <ResultBox>
            {monitoredPatients.length != 0 && !isFiltering && monitoredPatients.map((value,key) => {
              return (
                <ResultItem
                  onClick={() => {setSelectedPatient(value); onPatientClick(value)}}
                  nhsNum = {value.NHSNumber}
                  currentlySelected={selectedPatient.NHSNumber == value.NHSNumber}>
                  {value.fName} {value.lName}</ResultItem> )
              })
          }
          {monitoredPatients.length != 0 && isFiltering && filteredPatients.map((value,key) => {
            return (
              <ResultItem
                onClick={() => {setSelectedPatient(value); onPatientClick(value)}}
                nhsNum = {value.NHSNumber}
                currentlySelected={selectedPatient.NHSNumber == value.NHSNumber}>
                {value.fName} {value.lName}</ResultItem> )
            })
        }
          </ResultBox>
        </WhiteContainer>
        <ButtonBox>
          <Button onClick={() => handleViewClick()}>View Patient Records</Button>
          <UnmonitorButton onClick={() => handleUnmonitorClick()}>Unmonitor Patient</UnmonitorButton>
        </ButtonBox>
      </Container>
    </Card>
  )
}





const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 40vw;
  min-height: 300px;
  background: #C4C4C4;

`

const Container = styled.div`
  margin: 20px;
`
const Title = styled.div`
  position: relative;
  font-size: 25px;
  color:black;
  text-align: left;
  margin-bottom: 10px;
`

const WhiteContainer = styled.div`
  display: flex;
  align-content: flex-start;
  flex-direction: column;
  background: white;
  width: 95%;
  padding: 5px;
  min-height: 200px;
`

const ResultBox = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  min-height: 200px;
`

const ResultItem = styled.div`
  text-align: left;
  border: 1px dashed white;
  /* margin: 2px 0; */
  font-size: 15px;
  cursor: pointer;
  height: 20px;
  &:hover{
    background: #005EB870;
    border: 1px solid #005EB890 ;
  }
 ${({currentlySelected}) => (currentlySelected && 'background: #005EB890; text-color: white; border: 1px dashed black;')}
`

const Text = styled.div`
  position: relative;
  font-size: 15px;
  color:black;
  text-align: left;
  font-weight: bold;
  margin-bottom: 5px;
`

const ButtonBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
`

const Button = styled.button`
  height: 35px;
  width: 25%;
  background: #005EB890;
  border: 2px solid black;
  text-decoration: none;
  text-color: white;
  margin-top: 5px;
  cursor: pointer;
`

const UnmonitorButton = styled.button`
  height: 35px;
  width: 25%;
  background: #FF000090;
  border: 2px solid black;
  text-decoration: none;
  text-color: white;
  margin-top: 5px;
  cursor: pointer;
`
const Input = styled.input`
  width: 30%;
  height: 25px;
  color: #000000;
  border: 0;
  line-height: 120%;
  font-size: 18px;
  margin-bottom: 10px;
  margin-top: 4px;
  padding: 0 10px;
  border: 1px solid black;
  align-self: flex-start;
`
const Form = styled.form`
  padding: none;
  margin:none;
  display: flex;
  flex-direction: column;
  align-content: flex-start;
`
