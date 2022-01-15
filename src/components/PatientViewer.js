import React, { useState } from "react";
import PropTypes from 'prop-types'
import styled from "styled-components"
import DatePicker from "react-datepicker";
import {doc, collection,query, where, getDocs, Timestamp} from "firebase/firestore"
import { db } from '../utils/firebase'

import "react-datepicker/dist/react-datepicker.css";
import TimeSeriesChart from "./TimeSeriesChart";

export default function PatientViewer({patient, selected}){
    //const patient = input.patient
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [chartCreated, setChartCreated] = useState(false);
    const [chartData, setChartData] = useState();
    const [property, setProperty] = useState("BloodSugar");
    const [foodSubType, setFoodSubtype] = useState("Calories");
    const [chartYAxis, setChartYAxis] = useState("Blood Sugar Concentration (mmol/L)")

    async function generateGraph(){
      const rawData = await collectData(getQueryDetails(property))
      const dates = rawData.timestamps
      const vals = rawData.values
      var processedData = new Array(dates.length)

      console.log(rawData)

      for(let i =0; i<dates.length; i++){
        let processedTime = dates[i].getTime();
        let value = vals[i]
        processedData[i] = {value, processedTime}
      }
      console.log(processedData)
      setChartData(processedData)
      setChartCreated(true)
    }

    function getQueryDetails(pressedButton){
      var collectionName;//where in the firestore to query
      var targetField;//what field to query for
      var yaxis
      switch(pressedButton){
          case "BloodSugar":
            collectionName = "BloodSugar"
            targetField = "BS"
            yaxis = "Blood Sugar Concentration (mmol/L)"
            break;
          case "Food":
            collectionName = "FoodLog"
            targetField = foodSubType
            if (foodSubType=="Calories"){ yaxis = "Calories (kCal)"}
            else{yaxis = foodSubType + " (g)"}
            break;
          case "Exercise":
            collectionName = "ExerciseLog"
            targetField = "Duration"
            yaxis = "Exercise Duration (Minutes)"
            break;
      }
      setChartYAxis(yaxis)
      return {collectionName, targetField}
    }

    async function collectData(details){
        console.log(patient.NHSNumber)
        const patientDocRef = doc(db, "Patients", patient.NHSNumber)
        const colReference  = collection(patientDocRef, details.collectionName)
        //const start = Timestamp.fromDate(new Date("2022-01-01"))
        //const end = Timestamp.fromDate(new Date("2022-12-31"))
        const start = Timestamp.fromDate(startDate)
        const end = Timestamp.fromDate(endDate)

        const qSnap = await getDocs(query(colReference, where("Time", ">", start), where("Time", "<", end)))
        console.log(qSnap)
        console.log(details.collectionName)
        console.log(details.targetField)
        var timestamps = new Array(qSnap.size)
        var values = new Array(qSnap.size)
        var i = 0
        qSnap.forEach(item => {
          if(item.get(details.targetField) != null){
          timestamps[i] = item.get("Time").toDate()
          values[i] = Number(item.get(details.targetField) )
          i++
          }
          console.log(item)
      })

        return {timestamps, values}
    }

    return(

    <Card selected={selected}>
      <ProfileContainer>
      {patient != null &&
        <Title>{patient.fName} {patient.lName}</Title>
      }

      {patient != null &&
        <Title>{patient.NHSNumber}</Title>
      }
      </ProfileContainer>

      <GraphContainer>

        <LeftContainer>

        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
          <Menu>
            <LPropertyBar>
                <PropertyButton onClick={()=>setProperty("BloodSugar")} active={property=="BloodSugar"}>Blood Sugar</PropertyButton>
                <PropertyButton onClick={()=>setProperty("Food")} active={property=="Food"}>Food</PropertyButton>
                <PropertyButton onClick={()=>setProperty("Exercise")} active={property=="Exercise"}>Exercise</PropertyButton>

                <GraphButton onClick={()=>generateGraph(patient)}>View</GraphButton>
            </LPropertyBar>

            <RPropertyBar>
              <PropertyButton hidden={property!="Food"}
              onClick={()=>setFoodSubtype("Calories")}
              active={foodSubType=="Calories"}>Calories</PropertyButton>

              <PropertyButton hidden={property!="Food"}
              onClick={()=>setFoodSubtype("Carbs")}
              active={foodSubType=="Carbs"}>Carbs</PropertyButton>

              <PropertyButton
              hidden={property!="Food"}onClick={()=>setFoodSubtype("Sugars")}
              active={foodSubType=="Sugars"}>Sugars</PropertyButton>
            </RPropertyBar>

          </Menu>
        </LeftContainer>
        <RightContainer>

          {chartCreated && <TimeSeriesChart chartData={chartData} chartYAxis={chartYAxis} />}
        </RightContainer>
      </GraphContainer>

    </Card>

    )
}


const Card = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  bottom: 25px;
  width: 60vw;
  height: 74vh;
  background: #C4C4C4;
  padding: 20px;
`

const PropertyButton = styled.button`
  margin-top: 15px;
  /* margin-left: 25px; */
  background: #005EB8;
  color: white;
  border: none;
  text-decoration: none;
  border-radius: 10px;
  cursor: pointer;
  width:140px;
  height: 40px;
  border: 1.5px solid #005EB8;
  opacity: 0.6;
  ${({ active }) =>
    active &&
    `
    border: 1.5px solid black;
    opacity: 1;
  `}
`
const GraphButton = styled.button`
  margin-top: 15px;
  background: green;
  color: white;
  border: none;
  text-decoration: none;
  border-radius: 10px;
  cursor: pointer;
  width:140px;
  height: 40px;
  border: 2px solid black;
`

const LPropertyBar = styled.div`
  display: flex;
  flex-direction: column;
  display: flex;
  height: 315px;
`
const RPropertyBar = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  display: flex;
  height: 315px;
  left: 100px;
`


// ${(props) => (!props.selected && 'visibility:hidden;')};

const GraphContainer = styled.div`
  display:flex;
  position: static;
  background: white;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  height: 40vh;
  padding: 60px 30px;
  min-width: 20vw;
`

const Title = styled.div`
  position: relative;
  font-size: 25px;
  color:black;
  text-align: left;
  margin: 0 50px;
  font-weight: bold;
`

const Text = styled.div`
  position: relative;
  font-size: 15px;
  color:black;
  text-align: left;

`

const ProfileContainer = styled.div`
  background: white;
  display: flex;
  padding: 3px;
  justify-content: space-between;
  margin-bottom: 15px;
  min-height: 50px;
  align-items: center;
`

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;

`
const RightContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 30vw;
  height: 21vw;
  justify-content: center;
  padding: 0 20px;
`

const Menu = styled.div`
  display: flex;
  flex-direction: row;

`
