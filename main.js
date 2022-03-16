let lon
let lat
const CITY = document.querySelector("input")
let limit = 1
const KEY = "9dc46f67dfcdd64dfca56c839c8359f2"// key of api
const PRECIPITATION = document.querySelectorAll("span.probabilityP")//all the tags that indicate probability rain
const WEATHERICONS = ["img/weatherIcons/rainIcon.png", "img/weatherIcons/stormIcon.png", "img/weatherIcons/sunBehindCloudIcon.png", "img/weatherIcons/sunIcon.png", "img/weatherIcons/windIcon.png"]// an array with all the weather icons

function search(){
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${CITY.value}&limit=${limit}&appid=${KEY}`)//request to get the latitude and longitude of the city that user wants to see the weather forecast
    .then(response => {
        response.json()
        .then(data => {
            console.log(data)
            lat = data[0]["lat"]
            lon = data[0]["lon"]
            fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&exclude=current,minutely,hourly&appid=${KEY}`)//putting the latitude and longitude on the request to get the weather information
            .then(response=>{
                response.json()
                .then(data => {
                    console.log(data)
                    //setting the rain probability on html
                    for(let i = 0; i < 7; i++){
                        let rain = data["daily"][i]["rain"]//pega a informação da chuva
                        console.log(rain)
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
                    for(let i = 0; i <= 7; i++){
                        if(data["daily"][i]["weather"][0]["main"] == "Rain"){//verificando se vai chover
                            let icon = document.querySelectorAll("img.statusIcon")[i]//pegando a img daquele dia no html
                            icon.src = WEATHERICONS[0]//colocando a src dele para o icon de chuva
                            console.log(icon.src)
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