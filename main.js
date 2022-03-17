let lon
let lat
const CITY = document.querySelector("input")
let limit = 1
const KEY = "9dc46f67dfcdd64dfca56c839c8359f2"// key of api
const PRECIPITATION = document.querySelectorAll("span.probabilityP")//all the tags that indicate probability rain
const WEATHERICONS = ["img/weatherIcons/rainIcon.png", "img/weatherIcons/cloud.png","img/weatherIcons/stormIcon.png", "img/weatherIcons/sunBehindCloudIcon.png", "img/weatherIcons/sunIcon.png", "img/weatherIcons/windIcon.png"]// an array with all the weather icons
const ICONS = document.querySelectorAll("img.statusIcon")
const MIMTEMPP = document.querySelectorAll("span.minTempP")
const MAXTEMPP = document.querySelectorAll("span.maxTempP")
const REDBARS = document.querySelectorAll("div.redBar")
const GREYBARS = document.querySelectorAll("div.greyBar")
let day = document.querySelector("span.dayOfWeek")
let daynumber = document.querySelector("span.dayOfWeekNumber")
let mouthHtml = document.querySelector("span.mouthOfUser")
const TEMPNOW = document.querySelector("span.currentTemperature")

function search(){
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${CITY.value}&limit=${limit}&appid=${KEY}`)//request to get the latitude and longitude of the city that user wants to see the weather forecast
    .then(response => {
        response.json()
        .then(data => {
            lat = data[0]["lat"]
            lon = data[0]["lon"]
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&exclude=current,minutely,hourly&appid=${KEY}`)//putting the latitude and longitude on the request to get the weather information
            .then(response=>{
                response.json()
                .then(data => {
                    //setting the rain probability on html
                    for(let i = 0; i < 7; i++){
                        let rain = data["daily"][i]["rain"]//pega a informação da chuva
                        
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
                    //NÃO TA CHEGANDO AQUI
                    //setting day weather status in html img tags
                    for(let i = 0; i < 7; i++){
                        if(data["daily"][i]["weather"][0]["main"] == "Rain"){//verificando se vai chover//pegando a img daquele dia no html
                            ICONS[i].src = WEATHERICONS[0]//colocando a src dele para o icon de chuva
                        }
                        else if(data["daily"][i]["weather"][0]["main"] == "Clouds"){//pegando a img daquele dia no html
                            ICONS[i].src = WEATHERICONS[1]//colocando a src dele para o icon de chuva
                        }
                        else if(data["daily"][i]["weather"][0]["main"] == "Clear"){
                            ICONS[i].src = WEATHERICONS[4]
                        }
                    }
                    //adjusting maximum and minimum temperature chart information
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
                    var date = new Date()
                    const WEEK = ["Domingo-Feira", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"]
                    const MOUTH = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

                    let mouthOfUser = MOUTH[date.getMonth()]
                    let mouth = document.createTextNode(mouthOfUser)
                    mouthHtml.innerText = ""
                    mouthHtml.appendChild(mouth)

                    let dayOfWeek = WEEK[date.getDay()]//pegando o índice que se refere ao dia da semana na lista
                    day.innerText = dayOfWeek

                    let number = date.getDate()
                    number = document.createTextNode(number)
                    daynumber.innerText = ""
                    daynumber.appendChild(number)

                    console.log(data)
                })
            })
        })
    })
    .catch(error =>{
        console.log(error)
    })
    
}