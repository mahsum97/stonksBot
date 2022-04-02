import React from 'react'
import "../styles/Home.css"
import CustomChart from '../component/CustomChart';
import { useEffect, useState, useMemo } from 'react';
import Chart from 'react-apexcharts';

const stonksUrl = 'https://yahoo-finance-api.vercel.app/';
const stonks = ['GOOG', 'GME', 'AAPL']

const chart = {
    options: {
        colors : ['#b84644'],
        chart: {
            type: 'line',
            height: 350
        },
        title: {
            text: 'Line Chart',
            align: 'left',
            labels: {
                style: {
                    colors: ['white']
                }
              }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: ['white']
                }
              }
        },
        yaxis: {
            tooltip: {
            enabled: true
            },
            labels: {
                style: {
                    colors: ['white']
                }
              }
        },
        tooltip: {
            labels: {
                style: {
                    colors: ['black']
                }
              }
        }
      
    }
  };

const round = (number) => {
    return number ? +(number.toFixed(2)) : null;
  };

function Home() {
    const [series, setSeries] = useState([{
        data: []
      }]);
      const [price, setPrice] = useState(-1);
      const [prevPrice, setPrevPrice] = useState(-1);
      const [priceTime, setPriceTime] = useState(null);
      const [totalValue, setTotalValue] = useState(0);
      const [portfolio, setPortfolio] =  useState([]);
      const [totalChartconst, setTotalChartCOnst] = useState(0)
      const [sumQuotesConst, setSumQuotesConst] =  useState([]);


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
            portArray.push(stonks[i] + ", ");
          } else {
            portArray.push(stonks[i]);
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
        setTotalValue(totalPrice);
    }

    
    async function getLatestPrice() {
      try {
        const gme = totalChart.chart.result[0];
        setPrevPrice(price);
        setPrice(price);
        setPriceTime(new Date(gme.meta.regularMarketTime * 1000));
        const prices = gme.timestamp.map((timestamp, index) => ({
          x: new Date(timestamp * 1000),
          y: [sumQuotes[index]].map(round)
        }));
        setSeries([{
          data: prices,
        }]);
        console.log("done");
      } catch (error) {
        console.log(error);
      }
      timeoutId = setTimeout(getLatestPrice, 2000 * 2);

    }

    getTotalPrice();
    getLatestPrice();
    getPortFolio();
    setTotalChartCOnst(totalChart);
    setSumQuotesConst(sumQuotes);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const direction = useMemo(() => prevPrice < price ? 'up' : prevPrice > price ? 'down' : '', [prevPrice, price]);

  return (
    <div>
      <div className="ticker">
        TOTAL VALUE:
      </div>
      <div className={['price',direction ].join(' ')}>
        ${totalValue}
      </div>
      <div className="price-time">
        {priceTime && priceTime.toLocaleTimeString()}
      </div>
      <div className="portfolio">
        Portfolio: {portfolio}
      </div>
      <div className="chart">
        <Chart options={chart.options} series={series} type="line" width="100%" height={320} />
      </div>  
    </div>
  );
}

export default Home