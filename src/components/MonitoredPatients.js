import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components"
import { auth, db } from '../utils/firebase'
import { collection, query, where, getDocs} from "firebase/firestore"
import "firebase/compat/auth"

export default function MonitoredPatients(){
  const [monitoredPatients, setMonitoredPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState([])
  const [monitoredPatientNums, setMonitoredPatientNums] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [isFiltering, setIsFiltering] = useState(false)

  async function fetchPatientNums(){
   {/*fetches data from database*/}
   const cRef = collection(db, 'Doctors')
   console.log("Query")
   const qRef =  query(cRef, where("UID","==",auth.currentUser.uid))
   const qSnap = await qRef.get()
   setMonitoredPatients(qSnap[0].get("Following"))
   await fetchPatients()
 }

 async function fetchPatients(){
   console.log("Query")
   if(monitoredPatientNums.length != 0){
   const cRef = collection(db, "TestPat")
   const qRef = query(cRef, where("NHSNumber", "in", monitoredPatientNums))
   const qSnap = await qRef.getDocs()
   var i =0
   var array = []
   qSnap.forEach(item =>{
     array[i] = item.data()
   })
   setMonitoredPatients(array)
 }
 else{
   setMonitoredPatients([])
 }
 }


 useEffect(() => {
 {/* code here will run when page loads and whenever state of monitored patients changes*/}

   initializeLists()

   async function initializeLists(){

   const cRef = collection(db, 'Doctors')
   console.log("Query")
   const qRef =  query(cRef, where("UID","==",auth.currentUser.uid))
   const qSnap = await getDocs(qRef)
   console.log(qSnap.docs[0].get("Following"))
   const monitoredNums = qSnap.docs[0].get("Following")

   console.log("Query")
   if(monitoredNums.length != 0){
   const cRef = collection(db, "TestPat")
   const qRef = query(cRef, where("NHSNumber", "in", monitoredNums))
   const qSnap = await getDocs(qRef)
   var i =0
   var array = []
   qSnap.forEach(item =>{
     array[i] = item.data()
   })
   setMonitoredPatients(array)
 }
 else{
   setMonitoredPatients([])
 }
 setMonitoredPatientNums(monitoredNums)
 console.log(monitoredPatientNums)
 console.log(monitoredPatients)
  }
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

{/*
  const unmonitorPatient = async () => {
    const ref = db.collection('Doctors')
    const pRef = db.collection('TestPat')
    const queryRef = await ref.where('UID', '==', auth.currentUser.uid).limit(1).get().then(query => {
      const drDoc = query.docs[0]
      let drData = drDoc.data()
      if(drData.Following != null){

        } else {
          setError('You are already monitoring this patient')
        }
      } else {
        drDoc.ref.update(
          {Following: [newpatientnum]}
        )
      }
    })
  }
*/}
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
                  currentlySelected={selectedPatient.NHSNumber}>
                  {value.fName} {value.lName}</ResultItem> )
              })
          }
          {monitoredPatients.length != 0 && isFiltering && filteredPatients.map((value,key) => {
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
          <Button selected={selectedPatient} >View Patient Records</Button>
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
  width: 37vw;
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
  margin-top: 8px;
  cursor: pointer;
  ${(props) => (props.selected.length == 0 && 'background: #005EB830; border: 2px dashed grey; cursor: auto')}
`

const UnmonitorButton = styled.button`
  height: 35px;
  width: 25%;
  background: #FF000090;
  border: 2px solid black;
  text-decoration: none;
  text-color: white;
  margin-top: 8px;
  cursor: pointer;
  ${(props) => (props.selected.length == 0 && 'background: #005EB830; border: 2px dashed grey; cursor: auto')}
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
