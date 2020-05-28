$(document).ready(()=>{
  var url = currentUrl();
  // console.log("hello");
  const countriesUrl = 'https://api.covid19api.com/countries';
  var ctx = $('#covyChart').get(0).getContext('2d');

  let chartOptions = {
    responsive: false,
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        boxWidth: 80,
        fontColor: 'black'
      }
    }
  };

  var covyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: "Covid RD",
        data: [],
        borderColor: 'rgba(120, 184, 255, 1.0)',
        backgroundColor: 'rgba(120, 184, 255, 0.3)',
      }]
    },
    options: chartOptions
  });

  $('#countries-select').on('select2:select', function (event) {
    var data = event.params.data;
    covyChart.data.labels = [];
    covyChart.data.datasets[0].data = [];
    covyChart.data.datasets[0].label = "Covid " + data.text;
    url = currentUrl(data.id);
    getData(url, covyChart);
  });


  getData(url, covyChart);

  $('#countries-select').select2({
    placeholder: 'Elige un Pais',
    ajax:{
      url: countriesUrl,
      processResults: function (data) {
        let covyCountries = data.map((countryData)=>{
          return { id: countryData.Slug, text: countryData.Country }
        });

        return {
          results: covyCountries
        };
      }
    }
  });
});


const currentUrl = (currentCountry)=> {
  if (typeof currentCountry === 'undefined') {
    currentCountry = 'dominican-republic'
  }

  let countryUrl = 'https://api.covid19api.com/country/<COUNTRY>/status/confirmed/live'


  return countryUrl.replace('<COUNTRY>', currentCountry);
}


const getData = (url, covyChart)=>{
  $.ajax({
    type: 'GET',
    url: url,
    success: (response)=>{
      console.log(response);

      let covyLabels = response.map((entry)=>{
        const date = new Date(entry.Date);
        const dateOptions = { year: 'numeric', month: 'long', day: '2-digit' };
        const dateTimeFormat = new Intl.DateTimeFormat('es', dateOptions);

        return dateTimeFormat.format(date);
      });

      let covyCases = response.map((entry)=>{
        return entry.Cases;
      });
      // console.log(covyLabels);
      // console.log(covyCases);
      covyLabels.forEach((covyLabel, index)=>{
        covyChart.data.labels.push(covyLabel);
      });

      covyCases.forEach((covyCase, index)=>{
        covyChart.data.datasets[0].data.push(covyCase);
      });

      covyChart.update();
    }
  });
}














