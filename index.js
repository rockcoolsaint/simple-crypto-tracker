const query = JSON.stringify({
  json: {
      tokens: [
          "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
          "untrn"
      ],
      chainId: "neutron-1",
      dateRange: "D7"
  }
});

const encodedQuery = encodeURIComponent(query);
const tokens = [
  "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
  "untrn"
]

fetch(`https://app.astroport.fi/api/trpc/charts.prices?input=${encodedQuery}`)
  .then(response => response.json())
  .then(data => {
      // Assuming data contains an array of price points for the 7 days
      // console.log(tokens[0])
    //   console.log(data.result.data.json[tokens[0]].series);
      const dataList = data.result.data.json[tokens[0]].series;
      const prices = dataList.map(point => point.value); // Adjust according to actual data structure
      const averagePrice = prices.reduce((a, b) => a + b) / prices.length;
      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);

      // Update UI with calculated values
      document.getElementById('averagePrice').textContent = averagePrice.toFixed(2);
      document.getElementById('maxPrice').textContent = maxPrice.toFixed(2);
      document.getElementById('minPrice').textContent = minPrice.toFixed(2);

      // Proceed to draw the chart
      const ctx = document.getElementById('priceChart').getContext('2d');
      const chart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: dataList.map(point => point.time), // Assuming each point has a date property
              datasets: [{
                  label: '$ATOM-$NTRN Price',
                  data: prices,
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1
              }]
          },
          options: {
              scales: {
                  y: {
                      beginAtZero: false
                  }
              }
          }
      });
  })
  .catch(error => console.error('Error fetching data:', error));