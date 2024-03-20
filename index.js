var key = "";
fetch('./key.json')
    .then((response) => response.json())
        .then(({api_key}) => {
            key=api_key   
             })

const searchBtn = document.getElementById("search");
const todayBtn = document.getElementById('today');
const forecastBtn = document.getElementById('forecast');
const dateOptions = document.getElementById('date-options');
const timeOptions = document.getElementById('time-options');
const city = document.getElementById('city');

var isToday = true;


var selectedDate = new Date().toDateString();
var selectedTime = null;
var global_city_name = 'hello';
var datesObject={};

const capitalize = (word) => word[0].toUpperCase()+word.slice(1);


// update details 
function updateDetails(temp,temp_min,temp_max,main,description,icon,city_name){
    document.getElementById("details").style.display='block';
    cityName = document.getElementById("cityName");
    cityName.innerHTML=city_name[0].toUpperCase()+city_name.slice(1);
    
    temp_elements = document.getElementsByClassName('temperature');
    temp_elements[0].innerHTML = `<b>Min : </b>${temp_min}<sup>o</sup>C`;
    temp_elements[1].innerHTML = `<b>Max : </b>${temp_max}<sup>o</sup>C`;
    
    document.getElementById('temp-title').innerText='Temperature';
    icon_ele = document.getElementById("icon-image");
    icon_ele.setAttribute('src',   `https://openweathermap.org/img/wn/${icon}.png`);
    document.getElementById('description').innerText = capitalize(description);
    document.getElementById('main-description').innerText = capitalize(main);
    document.getElementById('current-temp').innerHTML =`${temp}<sup>o</sup>C`;
}

// API Fetching 
function fetching(city_name){
    console.log(key)
    global_city_name = city_name;
    let api_key=key;
    let url =   `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${api_key}`;
    let code = 404;
    if(isToday){
        fetch(url)
        .then((resp)=>resp.json())
        .then((data) =>{
                let {main:{temp,temp_min,temp_max},weather:[{main,description,icon}]} = data;
                updateDetails(temp,temp_min,temp_max,main,description,icon,city_name);
        })
        .catch(()=>{
            cityName = document.getElementById("cityName");
            cityName.innerText='.....     City Not Found     .....';
        })
    }
    else{
        let forecast_url = `https://api.openweathermap.org/data/2.5/forecast?q=${city_name}&&appid=${api_key}`;
        fetch(forecast_url)
        .then((resp)=>resp.json())
        .then(data=>{
            fcElements(data);
        })
        .catch(()=>{
            cityName = document.getElementById("cityName");
            cityName.innerText='.....     City Not Found     .....';
        })
    }
}

//search
searchBtn.addEventListener("click",(e)=>{
    let city_name = city.value;
    datesObject = {};
    if(city_name.trim().length!=0)
        fetching(city_name);
    else{
        document.getElementById("cityName").innerText='Enter Valid City Name';
    }
});

//today
todayBtn.addEventListener("click",(e)=>{
    isToday=true;
    document.title='WeatherVue - Today';
    document.getElementById("popup").style.transform='translateY(40px)';
    setTimeout(()=>{
        document.getElementById("popup").style.transform='translateY(-200px)';
    },3000)
})

//forecast
forecastBtn.addEventListener("click",(e)=>{
    isToday=false;
    document.title= 'WeatherVue - Forecast';
    document.getElementById("popup").style.transform='translateY(40px)';
    setTimeout(()=>{
        document.getElementById("popup").style.transform='translateY(-200px)';
    },3000)
})

// closed button for the popup
document.getElementById("closed").addEventListener("click",(e)=>{
    document.getElementById("popup").style.transform='translateY(-200px)';
})


// date options event listeners 
function dateOptionsMethod(obj){
    isDateClicked=true;
    selectedDate = obj.value;
    let availableTimings =[];
    for(let i in datesObject[selectedDate]){
        availableTimings.push(i);
    }
    document.getElementById('time').style.display='block';
    timeOptions.innerHTML='';
    let disableOption = document.createElement('option');
    disableOption.setAttribute('disabled',true);
    disableOption.setAttribute('selected',true);
    disableOption.setAttribute('hidden',true);
    disableOption.innerText='Select Timing'
    timeOptions.appendChild(disableOption);
    for(let i in availableTimings){
        let option = document.createElement('option');
        option.innerText=availableTimings[i];
        option.setAttribute('value',availableTimings[i]);
        timeOptions.appendChild(option);
    }
}

// time option event listeners
function timeOptionsMethod(obj){
    isTimeClicked = true;
    selectedTime = obj.value;
    let {main:{temp,temp_min,temp_max},weather:[{main,description,icon}]} = datesObject[selectedDate][selectedTime];
    updateDetails(temp,temp_min,temp_max,main,description,icon,global_city_name);

}

//adding forecast date-options 
function fcElements(data){
    
    var date_select = `Date : <select class="date-select" id="date-options" onChange='dateOptionsMethod(this)'> <option value="" selected disabled hidden>Choose the Date</option>`;

    for(let i of data.list)
    {
        let d = new Date(i.dt*1000).toDateString();
        let t = new Date(i.dt*1000).toLocaleTimeString()
        let {main:{temp,temp_min,temp_max},weather:[{main,description,icon}]} = i;
        if(!datesObject[d])
        {
            datesObject[d]={};
        }
        datesObject[d][t] ={
            "main":{
                temp,
                temp_min,
                temp_max
            },
            "weather":[
                {
                main,
                description,
                icon
                }
            ]
        }   
    }

    for(let i in datesObject)
    {
        date_select+=`<option value="${i}">${i}</option>`
    }

    date_select=date_select+'</select>';
    document.getElementById('date').style.display='block';
    document.getElementById('time').style.display='block';
    document.getElementById('time').insertBefore(document.createTextNode("Time : "),timeOptions);
    document.getElementById('date').innerHTML=date_select;
}


//  JSON format used to Store the Forecast Weather Condition Data 
 

// dateObject ={ date:[
//     {time:{
//         main:{
//             temp,
//             temp_min,
//             temp_max
//         },
//         weather:[
//             main,
//             description,
//             icon
//         ]
//     }}
// ],
// }