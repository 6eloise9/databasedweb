import React, { useState } from "react";
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
    const [property, setProperty] = useState();

    async function generateGraph(){
      const rawData = await collectData()
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

    async function collectData(){
        const patientDocRef = doc(db, "TestPat", patient.NHSNumber)
        const colReference  = collection(patientDocRef, "BloodSugar")
        const start = Timestamp.fromDate(new Date("2022-01-01"))
        const end = Timestamp.fromDate(new Date("2022-12-31"))

        const qSnap = await getDocs(query(colReference, where("dateTime", ">", start), where("dateTime", "<", end)))
        var timestamps = new Array(qSnap.size)
        var values = new Array(qSnap.size)
        var i = 0
        qSnap.forEach(item => {
          if(item.get("BloodSugar") != null){
          timestamps[i] = item.get("dateTime").toDate()
          values[i] = item.get("BloodSugar") 
          i++
          }
          console.log(item)
      })

        return {timestamps, values}
    }

    return(

    <MainContainer>
        <PropertyBar>
            <PropertyButton onClick={()=>setProperty("BloodSugar")}>Blood Sugar</PropertyButton>
            <PropertyButton onClick={()=>setProperty("Food")}>Food</PropertyButton>
            <PropertyButton onClick={()=>setProperty("Exercise")}>Exercise</PropertyButton>
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
            <GraphButton onClick={()=>generateGraph(patient)}>View</GraphButton>
        </PropertyBar>
        {chartCreated && <TimeSeriesChart chartData={chartData}/>}
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

const PropertyBar = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  display: flex;
  width: 100px;
  height: 315px;
  background: #C4C4C4;

`

const MainContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 1000px;
  height: 315px;
  background: #C4C4C4;

`

