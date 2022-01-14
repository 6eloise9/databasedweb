import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components"
import { auth, db } from '../utils/firebase'
import { collection, query, where, getDocs} from "firebase/firestore"
import "firebase/compat/auth"

export default function MonitoredPatients(){
  const [monitoredPatients, setMonitoredPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState([])
  const [monitoredPatientNums, setMonitoredPatientNums] = useState([])

  const fetchPatientNums = async () => {
    {/*fetches data from database*/}
    const drRef = await db.collection('Doctors')
    drRef.onSnapshot(snapshot => {
      const queryRef = drRef.where('UID', '==', auth.currentUser.uid).limit(1).get().then(query => {
      const drDoc = query.docs[0]
      const drData = drDoc.data()
      const patientNums = drData.Following
      setMonitoredPatientNums(patientNums)
      fetchPatients()
      })
    })
  }

  const fetchPatients = async () => {
    const pRef = db.collection('TestPat')
    pRef.onSnapshot(snapshot => {
      let pqueryRef = pRef.where('NHSNumber', 'in', monitoredPatientNums).get().then(query => {
        console.log(pqueryRef)
        const patDocs = query.docs
        let array = []
        for (let x in patDocs){
        array[x] = patDocs[x].data()
        }
        console.log(array)
        setMonitoredPatients(array)
      })
    })
  }


  useEffect(() => {
  {/* code here will run when page loads and whenever state of monitored patients changes*/}
   fetchPatientNums()
  },[monitoredPatients, monitoredPatientNums])

  async function onPatientClick(value){
    const temp = value
    setSelectedPatient(temp)
  }

  return(
    <Card>
      <Container>
        <Title>Patients you are monitoring</Title>
        <WhiteContainer>
          <ResultBox>
            {monitoredPatients.length != 0 && monitoredPatients.map((value,key) => {
              return (
                <ResultItem
                  onClick={() => {setSelectedPatient(value); onPatientClick(value)}}
                  nhsNum = {value.NHSNumber}
                  currentlySelected={selectedPatient.NHSNumber}>
                  {value.fName} {value.lName}</ResultItem> )
              })
          }
          </ResultBox>
        </WhiteContainer>
        <ButtonBox>
          <Button selected={selectedPatient}>View Patient Records</Button>
          <UnmonitorButton selected={selectedPatient}>Unmonitor Patient</UnmonitorButton>
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
  margin-top: 20px;
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
  flex-direction: column;
  background: white;
  width: 95%;
  padding: 13px;
`

const ResultBox = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 100%
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
 ${(props) => ((props.nhsNum == props.currentlySelected) && 'background: #005EB890; text-color: white; border: 1px dashed black;')}
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
  ${(props) => (props.selected.length == 0 && 'visibility: hidden')}
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
  ${(props) => (props.selected.length == 0 && 'visibility: hidden')}
`
