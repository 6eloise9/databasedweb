import React, { useState } from "react";
import PropTypes from 'prop-types'
import styled from "styled-components"
import DatePicker from "react-datepicker";
import {doc, collection,query, where, getDocs, Timestamp} from "firebase/firestore"
import { db } from '../utils/firebase'

import "react-datepicker/dist/react-datepicker.css";
import TimeSeriesChart from "./TimeSeriesChart";

export default function PatientViewer({patient}){
    //const patient = input.patient
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [chartCreated, setChartCreated] = useState(false);
    const [chartData, setChartData] = useState();
    const [property, setProperty] = useState("BloodSugar");
    const [foodSubType, setFoodSubtype] = useState("Calories");
    const [chartYAxis, setChartYAxis] = useState("Blood Sugar Concentration (mmol/L)")

    async function exportToCSV(patient){
      const rawData = await collectData(getQueryDetails(property))
      const dates = rawData.timestamps
      const vals = rawData.values

      var tableData = []
      var CSVData = "data:text/csv;charset=utf-8,"

      for(var i=0; i<dates.length;i++){
        tableData.push([dates[i], vals[i]])
        CSVData += tableData[i].join(",") + "\r\n";
      }


      var encodedUri = encodeURI(CSVData);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", property+patient.NHSNumber+".csv");
      document.body.appendChild(link); // Required for FF

      link.click()
      }

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
        const patientDocRef = doc(db, "TestPat", patient.NHSNumber)
        const colReference  = collection(patientDocRef, details.collectionName)
        const start = Timestamp.fromDate(new Date("2022-01-01"))
        const end = Timestamp.fromDate(new Date("2022-12-31"))

        const qSnap = await getDocs(query(colReference, where("Time", ">", start), where("Time", "<", end)))
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

    <MainContainer>
        <LPropertyBar>
            <PropertyButton onClick={()=>setProperty("BloodSugar")} active={property=="BloodSugar"}>Blood Sugar</PropertyButton>
            <PropertyButton onClick={()=>setProperty("Food")} active={property=="Food"}>Food</PropertyButton>
            <PropertyButton onClick={()=>setProperty("Exercise")} active={property=="Exercise"}>Exercise</PropertyButton>

            <GraphButton onClick={()=>generateGraph(patient)}>View</GraphButton>
            <GraphButton onClick={()=>exportToCSV(patient)}>Export</GraphButton>
        </LPropertyBar>

        <RPropertyBar>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />

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

        {chartCreated && <TimeSeriesChart chartData={chartData} chartYAxis={chartYAxis} />}

    </MainContainer>
        
    )
}

const PropertyButton = styled.button`
  margin-top: 15px;
  margin-left: 25px;
  background: #005EB8;
  color: white;
  border: none;
  text-decoration: none;
  border-radius: 10px;
  cursor: pointer;
  width:140px;
  height: 40px;
  opacity: 0.6;
  ${({ active }) =>
    active &&
    `
    opacity: 1;
  `}
`
const GraphButton = styled.button`
  margin-top: 15px;
  margin-left: 15px;
  background: #005EB8;
  color: white;
  border: none;
  text-decoration: none;
  border-radius: 10px;
  cursor: pointer;
  width:160px;
  height: 50px;
`

const LPropertyBar = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  display: flex;
  width: 100px;
  height: 315px;
`
const RPropertyBar = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  display: flex;
  width: 100px;
  height: 315px;
  left: 100px;
`

const MainContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 1000px;
  height: 315px;
  background: #C4C4C4;

`
