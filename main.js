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
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&exclude=current,minutely&appid=${WEATHERKEY}`)//putting the latitude and longitude on the request to get the weather information
            .then(response=>{
                response.json()
                .then(data => {
                    console.log(data)
                    //setting the humidity on html
                    const PRECIPITATION = document.querySelectorAll("span.probabilityP")//all the tags that indicate probability rain
                    for(let i = 0; i < 7; i++){
                        let humidity = data["daily"][i]["humidity"]//pega a informação da chuva
                        
                        if(humidity == undefined){//não tem porbabilidade de chuva = rain indefined
                            let no = document.createTextNode("0")
                            PRECIPITATION[i].innerText = ""
                            PRECIPITATION[i].appendChild(no)
                        }else{//item probabilidade
                            let no = document.createTextNode(humidity)
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
                    else if(data["daily"][indexOfDay]["weather"][0]["main"] == "Clouds"){
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

                    const FIRSTCOLUMN = document.querySelector("div.column__graphicBox___first")
                    const SECONDCOLUMN = document.querySelector("div.column__graphicBox___second")
                    const THIRDCOLUMN = document.querySelector("div.column__graphicBox___third")
                    const FOURTHCOLUMN = document.querySelector("div.column__graphicBox___fourth")
                    const FIFTHCOLUMN = document.querySelector("div.column__graphicBox___fifth")
                    const SIXTHCOLUMN = document.querySelector("div.column__graphicBox___sixth")

                    let hourlySize = data["hourly"];
                    hourlySize = hourlySize.length;

                    let verif1 = false
                    let verif2 = false
                    let verif3 = false
                    let verif4 = false
                    let verif5 = false
                    let verif6 = false

                    for(let i =0; i < hourlySize; i++){
                        let dt = data["hourly"][i]["dt"]

                        let utcSeconds = dt;
                        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                        d.setUTCSeconds(utcSeconds);
                        let hour = d.getHours()

                        console.log(`hour: ${hour} | I:${i}`)
                        switch(hour){
                            case 8:
                                if(verif1 == false){
                                    if(data["hourly"][i]["weather"][0]["main"] == "Clear"){
                                        console.log("entrou")
                                        FIRSTCOLUMN.style.background = "#FFEB3B"
                                        FIRSTCOLUMN.style.height = "20%"
                                        verif1 = true
                                    }
                                    else if(data["hourly"][i]["weather"][0]["main"] == "Rain"){
                                        FIRSTCOLUMN.style.height = "54%"
                                        verif1 = true
                                    }
                                    else if(data["hourly"][i]["weather"][0]["main"] == "Thunderstorm"){
                                        FIRSTCOLUMN.style.height = "85%"
                                        verif1 = true
                                    }
                                    else if(data["hourly"][i]["weather"][0]["main"] == "Clouds"){
                                        FIRSTCOLUMN.style.height = "37%"
                                        verif1 = true
                                    }
                                }
                                break 
                            case 23:
                                if(verif2 == false){
                                    if(data["hourly"][i]["weather"][0]["main"] == "Clear"){
                                        console.log("entrou")
                                        SECONDCOLUMN.style.background = "#FFEB3B"
                                        SECONDCOLUMN.style.height = "20%"
                                        verif2 = true
                                    }
                                    else if(data["hourly"][i]["weather"][0]["main"] == "Rain"){
                                        SECONDCOLUMN.style.height = "54%"
                                        verif2 = true
                                    }
                                    else if(data["hourly"][i]["weather"][0]["main"] == "Thunderstorm"){
                                        SECONDCOLUMN.style.height = "85%"
                                        verif2 = true
                                    }
                                    else if(data["hourly"][i]["weather"][0]["main"] == "Clouds"){
                                        SECONDCOLUMN.style.height = "37%"
                                        verif2 = true
                                    }
                                }
                                break
                            case 16:
                                if(verif3 == false){
                                    if(data["hourly"][i]["weather"][0]["main"] == "Clear"){
                                        console.log("entrou")
                                        THIRDCOLUMN.style.background = "#FFEB3B"
                                        THIRDCOLUMN.style.height = "20%"
                                        verif3 = true
                                    }
                                    else if(data["hourly"][i]["weather"][0]["main"] == "Rain"){
                                        THIRDCOLUMN.style.height = "54%"
                                        verif3 = true
                                    }
                                    else if(data["hourly"][i]["weather"][0]["main"] == "Thunderstorm"){
                                        THIRDCOLUMN.style.height = "85%"
                                        verif3 = true
                                    }
                                    else if(data["hourly"][i]["weather"][0]["main"] == "Clouds"){
                                        THIRDCOLUMN.style.height = "37%"
                                        verif3 = true
                                    }
                                }
                                break
                            case 20:
                                if(verif4 == false){
                                    if(data["hourly"][i]["weather"][0]["main"] == "Clear"){
                                        console.log("entrou")
                                        FOURTHCOLUMN.style.background = "#FFEB3B"
                                        FOURTHCOLUMN.style.height = "20%"
                                        verif4 = true
                                    }
                                    else if(data["hourly"][i]["weather"][0]["main"] == "Rain"){
                                        FOURTHCOLUMN.style.height = "54%"
                                        verif4 = true
                                    }
                                    else if(data["hourly"][i]["weather"][0]["main"] == "Thunderstorm"){
                                        FOURTHCOLUMN.style.height = "85%"
                                        verif4 = true
                                    }
                                    else if(data["hourly"][i]["weather"][0]["main"] == "Clouds"){
                                        FOURTHCOLUMN.style.height = "37%"
                                        verif4 = true
                                    }
                                }
                                break
                            case 12:
                                if(verif5 == false){
                                    if(data["hourly"][i]["weather"][0]["main"] == "Clear"){
                                        console.log("entrou")
                                        FIFTHCOLUMN.style.background = "#FFEB3B"
                                        FIFTHCOLUMN.style.height = "20%"
                                        verif5 = true
                                    }
                                    else if(data["hourly"][i]["weather"][0]["main"] == "Rain"){
                                        FIFTHCOLUMN.style.height = "54%"
                                        verif5 = true
                                    }
                                    else if(data["hourly"][i]["weather"][0]["main"] == "Thunderstorm"){
                                        FIFTHCOLUMN.style.height = "85%"
                                        verif5 = true
                                    }
                                    else if(data["hourly"][i]["weather"][0]["main"] == "Clouds"){
                                        FIFTHCOLUMN.style.height = "37%"
                                        verif5 = true
                                    }
                                }
                                break
                            case 4:
                                if(verif6 == false){
                                    if(data["hourly"][i]["weather"][0]["main"] == "Clear"){
                                        console.log("entrou")
                                        SIXTHCOLUMN.style.background = "#FFEB3B"
                                        SIXTHCOLUMN.style.height = "20%"
                                        verif6 = true
                                    }
                                    else if(data["hourly"][i]["weather"][0]["main"] == "Rain"){
                                        SIXTHCOLUMN.style.height = "54%"
                                        verif6 = true
                                    }
                                    else if(data["hourly"][i]["weather"][0]["main"] == "Thunderstorm"){
                                        SIXTHCOLUMN.style.height = "85%"
                                        verif6 = true
                                    }
                                    else if(data["hourly"][i]["weather"][0]["main"] == "Clouds"){
                                        SIXTHCOLUMN.style.height = "37%"
                                        verif6 = true
                                    }
                                }
                                break
                        }
                    }

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