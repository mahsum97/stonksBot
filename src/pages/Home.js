import React, { useRef } from 'react'
import "../styles/Home.css"
import CustomChart from '../component/CustomChart';
import { useEffect, useState } from 'react';
import stonksList from '../values/stonksList.json'
import axios from "axios"


const stonksUrl = 'https://yahoo-finance-api.vercel.app/';
const stonks = ['GOOG', 'GME', 'AAPL']

let stonk;

function Home() {
    
      const [priceTime, setPriceTime] = useState(null);
      const [totalValue, setTotalValue] = useState(0);
      const [portfolio, setPortfolio] =  useState([]);
      
      let combine = useRef(null);
      let totalChartconst = useRef(null);
      let sumQuotesConst = useRef(null);

    useEffect(() => {
    let timeoutId;
    let totalPrice = 0;
    let totalData;
    let totalChart;
    let dataPrices = [];
    let sumQuotes = [];
    let newQuotes = [];
    var positionList = Object.freeze([2, 1, 1, 1]);
    let positionValue;
    let bought = false;
    checkTime();
    
    function checkTime(){
      let dateTime = new Date()
      if(!bought){
        let stock = stonksList[Math.floor(Math.random() * stonksList.length)]
        getStockPrice(stock, 1, dateTime)
        stonks.push(stock)
        bought = true
        console.log("BIN DA")

      }
      if (dateTime.getHours() === '08' && dateTime.getMinutes() === '51') {
        bought = false
      }
      timeoutId = setTimeout(checkTime, 2000 * 2);
    }

    async function getStockPrice(symbol, count, timestamp) {
      let data = await fetch(stonksUrl + symbol);
      let dataJson = await data.json();
      let stockPrice = dataJson.chart.result[0].meta.regularMarketPrice.toFixed(2);
      const newStock = {
        stock: symbol,
        price: stockPrice
      }

      axios.post('http://localhost:3001/create', newStock)
      
      console.log("ESADASD: " + newStock)
    }


    function getPortFolio() {
      let portArray = []
        for(let i = 0; i < stonks.length; i++) {
          if(i !== stonks.length-1) {
            portArray.push(positionList[i] + "x " + stonks[i] + ", ");
          } else {
            portArray.push(positionList[i] + "x " + stonks[i]);
          }
        }
        setPortfolio(portArray)
    }

    function getPositionOfStock(stock) {
      if (stock <= positionList.length) {
        return positionList[stock];
      } else {
        return -1;
      }
    }

    async function getTotalPrice() {
        for(let i = 0; i < stonks.length; i++) {
            totalData = await fetch(stonksUrl + stonks[i]);
            totalChart = await totalData.json(); 
            positionValue = getPositionOfStock(i)    
            totalChartconst = totalChart.chart.result[0]       
            dataPrices.push(parseInt(totalChart.chart.result[0].meta.regularMarketPrice.toFixed(2) * positionValue))
            totalPrice = dataPrices.reduce((partialSum, a) => partialSum + a, 0);
            for(let j = 0; j < totalChart.chart.result[0].indicators.quote[0].close.length; j++) {
                newQuotes.push(parseInt(totalChart.chart.result[0].indicators.quote[0].close[j]))
                if(sumQuotes.length < newQuotes.length) {
                    sumQuotes[j] = newQuotes[j] * positionValue;
                } else {
                    sumQuotes[j] = sumQuotes[j] + newQuotes[j] * positionValue 
                }
            }
            newQuotes.length = 0
        }
        setPriceTime(new Date(totalChartconst.meta.regularMarketTime * 1000));
        setTotalValue(totalPrice);
        sumQuotesConst = sumQuotes
        combine.current = {
          quote: sumQuotesConst,
          gme: totalChartconst
        }
    }

    getTotalPrice();
    getPortFolio();
    

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div>
      <div className="ticker">
        TOTAL VALUE:
      </div>
      <div className={['price'].join(' ')}>
        ${totalValue}
      </div>
      <div className="price-time">
        {priceTime && priceTime.toLocaleTimeString()}
      </div>
      <div className="portfolio">
        Portfolio: {portfolio}
      </div>
      <div className="chart">
        <CustomChart customchart = {combine}/>
      </div>  
    </div>
  );
}

export default Home