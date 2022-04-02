import Chart from 'react-apexcharts';
import { useEffect, useState, useMemo } from 'react';
import "../styles/Home.css"
import React from 'react'

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
  
  function CustomChart(sumQuotes, totalChart) {

    const [series, setSeries] = useState([{
        data: []
      }]);
      const [price, setPrice] = useState(-1);
      const [prevPrice, setPrevPrice] = useState(-1);
      const [priceTime, setPriceTime] = useState(null);
      const [totalValue, setTotalValue] = useState(0);
      const [portfolio, setPortfolio] =  useState([]);

    useEffect(() => {
        let timeoutId;
        
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
          console.log("DONE");
        } catch (error) {
          console.log(error + "ERRRRRR " + totalChart.chart.result[0]);
        }
        timeoutId = setTimeout(getLatestPrice, 2000 * 2);
    
      }

      getLatestPrice();

      return () => {
        clearTimeout(timeoutId);
      };
    }, []);

    return (
    <div className="chart">
        <Chart options={chart.options} series={series} type="line" width="100%" height={320} />
    </div>      )
  }
  
  export default CustomChart
