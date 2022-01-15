import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components"
import { auth, db } from '../utils/firebase'
import { collection, query, where, getDocs} from "firebase/firestore"
import "firebase/compat/auth"


export default function PatientSearch({returnPatient, returnSelected}){
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState()
  const [isPatientSelected, patientSelected] = useState(false)
  const [input, setInput] = useState('');
  const [error, setError] = useState('')

  const fetch = async () => {
    {/*fetches data from database*/}
    const patientsRef = await db.collection('TestPat')
    patientsRef.onSnapshot(snapshot => {
      setPatients(snapshot.docs.map(doc => doc.data()))
    })
  }

  useEffect(() => {
  {/* code here will run when page loads*/}
   fetch()
  }, [])

  const updateFollowingList = async (newpatientnum) => {
    const ref = db.collection('Doctors')
    const queryRef = await ref.where('UID', '==', auth.currentUser.uid).limit(1).get().then(query => {
      const drDoc = query.docs[0]
      let drData = drDoc.data()
      if(drData.Following != null){
        const oldFollow = drData.Following
        if(!oldFollow.includes(newpatientnum)){
          drData.Following = [...oldFollow, newpatientnum]
          drDoc.ref.update(drData)
          updatePatientAlerts(drData)
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

  const updatePatientAlerts = async (doctor) => {
    console.log(doctor.email)
    if (doctor.email == null){
      setError('Your account has no associated email. Alerts will not reach you. Contact Admin')
    } else {
      const ref = db.collection('TestPat')
      const queryRef = await ref.where('NHSNumber', '==', selectedPatient.NHSNumber).limit(1).get().then(query => {
        const patDoc = query.docs[0]
        let patData = patDoc.data()
        console.log(patData)
        if(patData.Alerts != null){
          const oldAlerts = patData.Alerts
          const oldAlertsLC = oldAlerts.map(alert => alert.toLowerCase())
          if(!oldAlertsLC.includes(doctor.email.toLowerCase())){
            patData.Alerts = [...oldAlerts, doctor.email]
            patDoc.ref.update(patData)
          } else {
            setError('Please contact admin. Error: alerts and following out of sync')
          }
        } else {
          patDoc.ref.update(
            {Alerts: [doctor.email]}
          )
        }
      })
    }
  }

  const handleChange = async (e) => {
    const searchseq = e.target.value
    const newPat = patients.filter((value) => {
      return value.NHSNumber.includes(searchseq)
    })
    setFilteredPatients(newPat)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const searchseq = e.target.value
  }


  async function onPatientClick(value){
    const temp = value
    setSelectedPatient(temp)
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
       {error && <Error>{error}</Error>}
      </LeftContainer>

      <RightContainer>
        <SearchText>Search Results</SearchText>
        <ResultBox>

          {filteredPatients.length != 0 && filteredPatients.map((value,key) => {
            return (
              <ResultItem
                onClick={() => {setSelectedPatient(value); onPatientClick(value); setError('')}}
                nhsNum = {value.NHSNumber}
                currentlySelected={selectedPatient.NHSNumber}>
                {value.fName} {value.lName}</ResultItem> )
          })
        }
        </ResultBox>
        <ButtonBox>
          <MonitorButton selected={selectedPatient} onClick = {() => updateFollowingList(selectedPatient.NHSNumber)}>Monitor Patient</MonitorButton>
          <MonitorButton selected={selectedPatient}>View Patient</MonitorButton>
        </ButtonBox>

      </RightContainer>
    </MainContainer>
  )
}


const MainContainer = styled.div`
  position: relative;
  display: flex;
  width: 40vw;
  height: 315px;
  background: #C4C4C4;
`

const LeftContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  min-width: 40%;
  margin: 20px;
`

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  width: 55%;
  margin: 20px;
  padding: 13px;
`

const Title = styled.div`
  position: relative;
  font-size: 25px;
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
  font-size: 15px;
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
  border: 1px dashed white;
  /* margin: 2px 0; */
  font-size: 15px;
  cursor: pointer;
  &:hover{
    background: #005EB870;
    border: 1px solid #005EB890 ;
  }
  ${(props) => ((props.nhsNum == props.currentlySelected) && 'background: #005EB890; text-color: white; border: 1px dashed black;')}
`

const ResultBox = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 100%
`
const ButtonBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

const MonitorButton = styled.button`
  height: 40px;
  width: 48%;
  background: #005EB890;
  border: 2px solid black;
  text-decoration: none;
  text-color: white;
  margin-top: 5px;
  cursor: pointer;
  ${(props) => (props.selected.length == 0 && 'background: #005EB830; border: 2px dashed grey; cursor: auto')}
`
const Error = styled.div`
  position: relative;
  background #FF000090 ;
  /* width: 400px; */
  /* height: 30px; */
  border-radius: 10px;
  color: white;
  text-align: center;
  font-size: 15px;

`
