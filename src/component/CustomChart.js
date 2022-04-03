import Chart from 'react-apexcharts';
import { useEffect, useState } from 'react';
import "../styles/Home.css"
import React from 'react'

const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
var googleFinance = require('google-finance');

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
  
  function CustomChart (combine) {

    const [series, setSeries] = useState([{
        data: []
      }]);

    useEffect(() => {
        let timeoutId;
        googleFinance.historical({
          symbol: 'NASDAQ:AAPL',
          from: '2014-01-01',
          to: '2014-12-31'
        }, function (err, quotes) {
          console.log(err + " " + quotes);
        });
    async function getLatestPrice() {
        try {
          const gme = combine.customchart.current.gme;

          const prices = gme.timestamp.map((timestamp, index) => ({
            x: new Date(timestamp * 1000),
            y: [combine.customchart.current.quote[index]].map(round)
          }));
          setSeries([{
            data: prices,
          }]);
          console.log("DONE");
        } catch (error) {
          console.log(error);
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
