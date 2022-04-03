import React, { useRef } from 'react'
import "../styles/Home.css"
import CustomChart from '../component/CustomChart';
import { useEffect, useState } from 'react';


const stonksUrl = 'https://yahoo-finance-api.vercel.app/';
const stonks = ['GOOG', 'GME', 'AAPL']

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
    var positionList = Object.freeze([2, 1, 1]);
    let positionValue;
    

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