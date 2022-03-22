let lon
let lat
latestResearch = []
const CITY = document.querySelector("input")
const WEATHERKEY = "9dc46f67dfcdd64dfca56c839c8359f2"// key of OpenWeatherForecast api
const FLICKRKEY = `118d64425544ea8d186c43fb0a75f2b0`// key of Flickr API

if(window.screen.width < 1000){
    const SECTIONMOBILE = document.querySelector("section.mobileForecast")
    const SECTIONHOME = document.querySelector("section.home")
    const SECTIONFORECASTDESKTOP = document.querySelector("section.forecast")

    SECTIONFORECASTDESKTOP.style.display = "none"
    SECTIONHOME.style.display = 'none'
    SECTIONMOBILE.style.display = 'flex'
}
//when the user search
document.addEventListener("keypress", function(e){
    if(e.key === "Enter" || e.key == "End"){
        search()
    }
})

function search(){
    // console.log(latestResearch.length)
    // if(latestResearch.length < 4){
    //     console.log("lista")
    //     latestResearch.push(CITY.value)
    // }
    // else{
    //     console.log("else")
    //     latestResearch.pop()
    //     latestResearch.push(CITY.value)
    // }
    //pattern
    let valueCityInput;

    if(CITY.value == null || CITY.value == undefined || CITY.value == ''){
        valueCityInput = "Brasília"
    }
    else{
        valueCityInput = CITY.value
    }
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${valueCityInput}&limit=1&appid=${WEATHERKEY}`)//request to get the latitude and longitude of the city that user wants to see the weather forecast
    .then(response => {
        response.json()
        .then(data => {
            const COUNTRY = document.querySelector("span.country")
            let countryName = data[0]["country"]
            COUNTRY.innerText = countryName
            lat = data[0]["lat"]
            lon = data[0]["lon"]
            console.log(data)
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&exclude=current,minutely&appid=${WEATHERKEY}`)//putting the latitude and longitude on the request to get the weather information
            .then(response=>{
                response.json()
                .then(data => {
                    //setting the humidity on html
                    const PRECIPITATION = document.querySelectorAll("span.probabilityP")//all the tags that indicate probability rain
                    for(let i = 0; i < 7; i++){
                        let rain = data["daily"][i]["humidity"]//pega a informação da chuva
                        
                        if(rain == undefined){//não tem porbabilidade de chuva = rain indefined
                            let no = document.createTextNode("0")
                            PRECIPITATION[i].innerText = ""
                            PRECIPITATION[i].appendChild(no)
                        }else{//item probabilidade
                            let no = document.createTextNode(rain)
                            PRECIPITATION[i].innerText = ""
                            PRECIPITATION[i].appendChild(no)//colocando a porbabilidade no html
                        }
                    }
                    //setting day weather status in html img tags
                    const WEATHERICONS = ["img/weatherIcons/rainIcon.png", "img/weatherIcons/cloud.png","img/weatherIcons/stormIcon.png", "img/weatherIcons/sunBehindCloudIcon.png", "img/weatherIcons/sunIcon.png", "img/weatherIcons/windIcon.png", "img/weatherIcons/snowIcon.png", "img/weatherIcons/drizzleIcon.png"]// an array with all the weather icons
                    const ICONS = document.querySelectorAll("img.statusIcon")
                    for(let i = 0; i < 7; i++){
                        if(data["daily"][i]["weather"][0]["main"] == "Rain"){//verificando se vai chover//pegando a img daquele dia no html
                            ICONS[i].src = WEATHERICONS[0]//colocando a src dele para o icon de chuva
                        }
                        else if(data["daily"][i]["weather"][0]["main"] == "Clouds"){//pegando a img daquele dia no html
                            ICONS[i].src = WEATHERICONS[1]//colocando a src dele para o icon de chuva
                        }
                        else if(data["daily"][i]["weather"][0]["main"] == "Thunderstorm"){
                            ICONS[i].src = WEATHERICONS[2]
                        }
                        else if(data["daily"][i]["weather"][0]["main"] == "Clear"){
                            ICONS[i].src = WEATHERICONS[4]
                        }
                        else if(data["daily"][i]["weather"][0]["main"] == "Snow"){
                            ICONS[i].src = WEATHERICONS[6]
                        }
                        else if(data["daily"][i]["weather"][0]["main"] == "Drizzle"){
                            ICONS[i].src = WEATHERICONS[7]
                        }
                        
                    }
                    //adjusting maximum and minimum temperature chart information
                    const MIMTEMPP = document.querySelectorAll("span.minTempP")
                    const MAXTEMPP = document.querySelectorAll("span.maxTempP")
                    const REDBARS = document.querySelectorAll("div.redBar")
                    const GREYBARS = document.querySelectorAll("div.greyBar")
                    for(let i = 0; i < 7; i++){
                        let max = data["daily"][i]["temp"]["max"]
                        let min = data["daily"][i]["temp"]["min"]
                        
                        REDBARS[i].style.width = `${max}%`
                        GREYBARS[i].style.width = `${min}%`


                        max = document.createTextNode(max)
                        min = document.createTextNode(min)
                        
                        MIMTEMPP[i].innerText = ""
                        MAXTEMPP[i].innerText = ""
                        MIMTEMPP[i].appendChild(min)
                        MAXTEMPP[i].appendChild(max)
                    }
                    //getting date information
                    var date = new Date()
                    const WEEK = ["Domingo-Feira", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"]
                    const MOUTH = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
                    
                    //showing the current month in the now day
                    let mouthHtml = document.querySelector("span.mouthOfUser")
                    let mouthOfUser = MOUTH[date.getMonth()]
                    let mouth = document.createTextNode(mouthOfUser)
                    mouthHtml.innerText = ""
                    mouthHtml.appendChild(mouth)

                    //showing the name of the day of the week
                    let day = document.querySelector("span.dayOfWeek")
                    let dayOfWeek = WEEK[date.getDay()]//pegando o índice que se refere ao dia da semana na lista
                    day.innerText = dayOfWeek
                    //putting the right status icon of the day
                    const CURRENTFORECASTSTATUSICON = document.querySelector('div.CURRENTFORECASTSTATUSICON')
                    let indexOfDay = date.getDay()
                    console.log(indexOfDay)
                    if(data["daily"][indexOfDay]["weather"][0]["main"] == "Rain"){
                        CURRENTFORECASTSTATUSICON.classList.add("rain");
                    }
                    else if(data["daily"][indexOfDay]["weather"][0]["main"] == "Clear"){
                        CURRENTFORECASTSTATUSICON.classList.add("sunny");
                    }
                    else if(data["daily"][indexOfDay]["weather"][0]["main"] == "Snow"){
                        CURRENTFORECASTSTATUSICON.classList.add("snow");
                    }
                    else if(data["daily"][indexOfDay]["weather"][0]["main"] == "Thunderstorm"){
                        CURRENTFORECASTSTATUSICON.classList.add("storm");
                    }
                    else if(data["daily"][indexOfDay]["weather"][0]["main"] == "Cloud"){
                        CURRENTFORECASTSTATUSICON.classList.add("cloud");
                    }
                    else if(data["daily"][indexOfDay]["weather"][0]["main"] == "Drizzle"){
                        CURRENTFORECASTSTATUSICON.classList.add("drizzle");
                    }

                    //showing the day number
                    let daynumber = document.querySelector("span.dayOfWeekNumber")
                    let number = date.getDate()
                    number = document.createTextNode(number)
                    daynumber.innerText = ""
                    daynumber.appendChild(number)

                    console.log(data)

                    let dayOfWeekNumber = date.getDay()
                    dayHour = date.getHours()

                    const TEMPNOW = document.querySelector("span.currentTemperature")
                    const FEELSLIKE = document.querySelector("span.feelsLike")
                    //showing current temperature and the feels like based on time of day
                    if(dayHour >= 1 && dayHour <= 12){
                        console.log("morning")
                        let tempNowWindow = data["daily"][dayOfWeekNumber]["temp"]["morn"]
                        tempNowWindow = document.createTextNode(tempNowWindow)
                        TEMPNOW.innerText = ""
                        TEMPNOW.appendChild(tempNowWindow)
                        console.log(TEMPNOW)

                        let feelsLikeInformation = data["daily"][dayOfWeekNumber]["feels_like"]["morn"]
                        feelsLikeInformation = document.createTextNode(feelsLikeInformation)
                        FEELSLIKE.innerText = ""
                        FEELSLIKE.appendChild(feelsLikeInformation)
                    }
                    else if(dayHour >= 13 && dayHour <= 16){
                        console.log("day")
                        let tempNowWindow = data["daily"][dayOfWeekNumber]["temp"]["day"]
                        tempNowWindow = document.createTextNode(tempNowWindow)
                        TEMPNOW.innerText = ""
                        TEMPNOW.appendChild(tempNowWindow)

                        let feelsLikeInformation = data["daily"][dayOfWeekNumber]["feels_like"]["day"]
                        feelsLikeInformation = document.createTextNode(feelsLikeInformation)
                        FEELSLIKE.innerText = ""
                        FEELSLIKE.appendChild(feelsLikeInformation)
                    }
                    else if(dayHour >= 17 && dayHour <= 18){
                        console.log("eve")
                        let tempNowWindow = data["daily"][dayOfWeekNumber]["temp"]["eve"]
                        tempNowWindow = document.createTextNode(tempNowWindow)
                        TEMPNOW.innerText = ""
                        TEMPNOW.appendChild(tempNowWindow)

                        let feelsLikeInformation = data["daily"][dayOfWeekNumber]["feels_like"]["eve"]
                        feelsLikeInformation = document.createTextNode(feelsLikeInformation)
                        FEELSLIKE.innerText = ""
                        FEELSLIKE.appendChild(feelsLikeInformation)
                    }
                    else if(dayHour >=19 && dayHour <= 23){
                        console.log("night")
                        let tempNowWindow = data["daily"][dayOfWeekNumber]["temp"]["night"]
                        tempNowWindow = document.createTextNode(tempNowWindow)
                        TEMPNOW.innerText = ""
                        TEMPNOW.appendChild(tempNowWindow)

                        let feelsLikeInformation = data["daily"][dayOfWeekNumber]["feels_like"]["night"]
                        feelsLikeInformation = document.createTextNode(feelsLikeInformation)
                        FEELSLIKE.innerText = ""
                        FEELSLIKE.appendChild(feelsLikeInformation)
                    }

                    //showing the name of the search city
                    let cityName = CITY.value
                    if(CITY.value == null || CITY.value == undefined || CITY.value == ''){
                        cityName = "Brasília"
                    }

                    const RESEARCHEDCITY = document.querySelector("span.researchedCity")

                    RESEARCHEDCITY.innerText = ""
                    RESEARCHEDCITY.innerText = cityName[0].toUpperCase() + cityName.slice(1).toLowerCase()

                    //showing the sunset hour
                    const SUNSET = document.querySelector("span.sunset")
                    let sunsetInformation = data["daily"][dayOfWeekNumber]["sunset"]
                    sunsetInformation = new Date(sunsetInformation*1000)
                    let sunsetInformationHours = sunsetInformation.getHours()
                    let sunsetInformationMinutes = sunsetInformation.getMinutes()
                    sunsetInformation = sunsetInformationHours + ":" + sunsetInformationMinutes
                    sunsetInformation = document.createTextNode(sunsetInformation)
                    SUNSET.innerText = ""
                    SUNSET.appendChild(sunsetInformation)
                    
                    const CITYONWINDOW = document.querySelectorAll("img.imgCity")
                    const NAMEOFCITYONWINDOW = document.querySelectorAll("figcaption")
                    // for(let i = 0; i < 48; i++){
                    //     if(data["hourly"][i][dt] == )
                    // }
                    // console.log(NAMEOFCITYONWINDOW)
                    // for(let i = 0; i < 4; i++){
                    //     NAMEOFCITYONWINDOW[i].innerText = ""
                    //     NAMEOFCITYONWINDOW[i].innerText = latestResearch[i]
                    //     NAMEOFCITYONWINDOW.img.src= "img/img-teste/curitiba.png"
                    //     console.log(latestResearch[i])
                    // }
                })
            })
        })
    })
    .catch(error =>{
        console.log(error)
    })
}
//pattern forecast
search()