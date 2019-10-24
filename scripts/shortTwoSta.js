
var optiot = { hour: '2-digit', minute: '2-digit', hour12: false };
var options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };

//Henkilön syöttämät asemat:
$('#buttonForSearch').on('click', function () {

    var scheduleTable = document.getElementById('schedule');

    var departure = $('#start').val();
    var arrival = $('#end').val();

    var depSta;
    var destSta;

    $.ajax({
        url: staName(departure, arrival, function (staArr) {
            for (i = 0; i < staArr.length; i++) {
                if (departure.substring(0, 5) === staArr[i].stationName.substring(0, 5) && staArr[i].passengerTraffic === true) {
                    console.log(staArr[i].stationName);
                    console.log(staArr[i].stationShortCode);
                    depSta = staArr[i].stationShortCode;
                }
                if (arrival.substring(0, 5) === staArr[i].stationName.substring(0, 5) && staArr[i].passengerTraffic === true) {
                    console.log(staArr[i].stationName);
                    console.log(staArr[i].stationShortCode);
                    destSta = staArr[i].stationShortCode;
                }
            }
        }),
        success: function () {
            junaData(depSta, destSta, function (nextTrainsArr) {
                for (i = 0; i < nextTrainsArr.length; i++) {
                    var trElement = document.createElement('tr');

                    for (j = 0; j < nextTrainsArr[i].timeTableRows.length; j++) {
                        if (depSta === nextTrainsArr[i].timeTableRows[j].stationShortCode && nextTrainsArr[i].timeTableRows[j].type === 'DEPARTURE') {
                            var tdTrainCateg = document.createElement('td');
                            var tdTrainType = document.createElement('td');
                            var tdTrainNo = document.createElement('td');
                            var tdDepDate = document.createElement('td');
                            var tdDepTime = document.createElement('td');
                            var tdAlert = document.createElement('td');

                            var trainCateg = nextTrainsArr[i].trainCategory;
                            var trainType = nextTrainsArr[i].trainType;
                            var trainNo = nextTrainsArr[i].trainNumber;

                            var depDate = new Date(nextTrainsArr[i].departureDate).toLocaleDateString("fi-FI", options);

                            var depTime = new Date(nextTrainsArr[i].timeTableRows[j].scheduledTime).toLocaleTimeString('fi', optiot);

                            var alert = nextTrainsArr[i].timeTableRows[j].cancelled;

                            tdTrainCateg.innerText = (`${trainCateg}`);
                            tdTrainType.innerText = (`${trainType}`);
                            tdTrainNo.innerText = (`${trainNo}`);
                            tdDepDate.innerText = (`${depDate}`);
                            tdDepTime.innerText = (`${depTime}`);

                            // Lisää matka-aika, jos ei ole peruttu!
                            if (alert === false) {
                                tdAlert.innerText = '';
                            } else {
                                tdAlert.innerText = ('Juna on peruttu');
                            }

                        }
                        if (destSta === nextTrainsArr[i].timeTableRows[j].stationShortCode && nextTrainsArr[i].timeTableRows[j].type === 'ARRIVAL') {
                            var tdArrTime = document.createElement('td');
                            var arrTime = new Date(nextTrainsArr[i].timeTableRows[j].scheduledTime).toLocaleTimeString('fi', optiot);

                            tdArrTime.innerText = (`${arrTime}`);

                        }
                    }
                    trElement.appendChild(tdTrainCateg);
                    trElement.appendChild(tdTrainType);
                    trElement.appendChild(tdTrainNo);
                    trElement.appendChild(tdDepDate);
                    trElement.appendChild(tdDepTime);
                    trElement.appendChild(tdArrTime);
                    trElement.appendChild(tdAlert);
                    scheduleTable.appendChild(trElement);
                }
                console.log(nextTrainsArr);

                var result = document.getElementById('twoStations');
                result.innerText = (`${departure} - ${arrival}`);
            });
            while (scheduleTable.lastChild) {
                scheduleTable.removeChild(scheduleTable.lastChild);
            }
        }
    })

    console.log("ButtonForSearch klik");
});