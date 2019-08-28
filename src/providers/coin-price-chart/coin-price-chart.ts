import { Injectable } from '@angular/core';

import * as HighCharts from 'highcharts';
import { CoingeckoProvider } from '../coingecko/coingecko';

/*
  Generated class for the CoinPriceChartProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CoinPriceChartProvider {
  constructor(public coingeckoProvider: CoingeckoProvider) {
    console.log('Hello CoinPriceChartProvider Provider');
    this.init();
  }

  private init() {
    this.initTheme();
  }

  private initTheme() {
    HighCharts.theme = {
      colors: [
        '#2b908f',
        '#90ee7e',
        '#f45b5b',
        '#7798BF',
        '#aaeeee',
        '#ff0066',
        '#eeaaee',
        '#55BF3B',
        '#DF5353',
        '#7798BF',
        '#aaeeee'
      ],

      chart: {
        renderTo: 'container',
        height: 300,
        defaultSeriesType: 'areaspline',
        backgroundColor: 'rgba(255, 255, 255, 0.0)',
        style: {
          fontFamily: "'Unica One', sans-serif"
        },
        plotBorderColor: '#FFFFFF'
      },
      title: {
        style: {
          color: '#E0E0E3',
          textTransform: 'uppercase',
          fontSize: '16px'
        }
      },
      subtitle: {
        style: {
          color: '#E0E0E3',
          textTransform: 'uppercase'
        }
      },
      xAxis: {
        gridLineColor: '#707073',
        labels: {
          style: {
            color: '#E0E0E3'
          }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        title: {
          style: {
            color: '#A0A0A3'
          }
        }
      },
      yAxis: {
        gridLineColor: '#707073',
        labels: {
          style: {
            color: '#E0E0E3'
          }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        tickWidth: 1,
        title: {
          style: {
            color: '#A0A0A3'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
          color: '#F0F0F0'
        }
      },
      plotOptions: {
        series: {
          dataLabels: {
            color: '#B0B0B3'
          },
          marker: {
            lineColor: '#333'
          }
        },
        boxplot: {
          fillColor: '#505053'
        },
        candlestick: {
          lineColor: 'white'
        },
        errorbar: {
          color: 'white'
        }
      },
      legend: {
        itemStyle: {
          color: '#E0E0E3'
        },
        itemHoverStyle: {
          color: '#FFF'
        },
        itemHiddenStyle: {
          color: '#606063'
        }
      },
      credits: {
        style: {
          color: '#666'
        }
      },
      labels: {
        style: {
          color: '#707073'
        }
      },

      drilldown: {
        activeAxisLabelStyle: {
          color: '#F0F0F3'
        },
        activeDataLabelStyle: {
          color: '#F0F0F3'
        }
      },

      navigation: {
        buttonOptions: {
          symbolStroke: '#DDDDDD',
          theme: {
            fill: '#505053'
          }
        }
      },

      // scroll charts
      rangeSelector: {
        buttonTheme: {
          fill: '#505053',
          stroke: '#000000',
          style: {
            color: '#CCC'
          },
          states: {
            hover: {
              fill: '#707073',
              stroke: '#000000',
              style: {
                color: 'white'
              }
            },
            select: {
              fill: '#000003',
              stroke: '#000000',
              style: {
                color: 'white'
              }
            }
          }
        },
        inputBoxBorderColor: '#505053',
        inputStyle: {
          backgroundColor: '#333',
          color: 'silver'
        },
        labelStyle: {
          color: 'silver'
        }
      },

      navigator: {
        handles: {
          backgroundColor: '#666',
          borderColor: '#AAA'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(255,255,255,0.1)',
        series: {
          color: '#7798BF',
          lineColor: '#A6C7ED'
        },
        xAxis: {
          gridLineColor: '#505053'
        }
      },

      scrollbar: {
        barBackgroundColor: '#808083',
        barBorderColor: '#808083',
        buttonArrowColor: '#CCC',
        buttonBackgroundColor: '#606063',
        buttonBorderColor: '#606063',
        rifleColor: '#FFF',
        trackBackgroundColor: '#404043',
        trackBorderColor: '#404043'
      },

      // special colors for some of the
      legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
      background2: '#505053',
      dataLabelsColor: '#B0B0B3',
      textColor: '#C0C0C0',
      contrastTextColor: '#F0F0F3',
      maskColor: 'rgba(255,255,255,0.3)'
    };
    HighCharts.setOptions(HighCharts.theme);
  }

  private initChart(data, from_coin, to_coin) {
    HighCharts.chart('container', {
      credits: {
        enabled: false
      },
      chart: {
        margin: 0,
        zoomType: 'x',
      },
      title: {
        text: null
      },
      subtitle: {
        text: null
      },
      xAxis: {
        visible: false
      },
      yAxis: {
        visible: false
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, HighCharts.getOptions().colors[0]],
              [
                1,
                HighCharts.Color(HighCharts.getOptions().colors[0])
                  .setOpacity(0)
                  .get('rgba')
              ]
            ]
          },
          marker: {
            radius: 1
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },

      series: [
        {
          type: 'area',
          name: `${from_coin.toUpperCase()} to ${to_coin.toUpperCase()}`,
          data: data.prices
        }
      ]
    });
  }

  load(coin: any, duration: number, to_coin: string) {
    // console.log(' coin.id coin.id', coin.id)
    // console.log(duration)
    // console.log(to_coin)
    if(coin.id === 'proximax' || coin.id === 'pundi-x' || coin.id === 'sportsfix'){
      this.coingeckoProvider
      .getPrices(coin.id, to_coin, duration)
      .subscribe(data => {
        // console.log(data);
        this.initChart(data, coin.symbol, to_coin);
      });
    }
    
  }
}
