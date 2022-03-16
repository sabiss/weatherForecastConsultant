let lon
let lat
const CITY = document.querySelector("input")
let limit = 1
const KEY = "9dc46f67dfcdd64dfca56c839c8359f2"
const PRECIPITATION = document.querySelectorAll("span.probabilityP")

function search(){
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${CITY.value}&limit=${limit}&appid=${KEY}`)
    .then(response => {
        response.json()
        .then(data => {
            console.log(data)
            lat = data[0]["lat"]
            lon = data[0]["lon"]
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&exclude=current,minutely,hourly&appid=${KEY}`)
            .then(response=>{
                response.json()
                .then(data => {
                    console.log(data)
                    for(let i = 0; i <= 7; i++){
                        let rain = data["daily"][i]["rain"]
                        console.log(rain)
                        let no = document.createTextNode(rain)
                        PRECIPITATION[i].innerHTML = ""
                        PRECIPITATION[i].appendChild(no)
                        
                    }

                })
            })
        })
    })
    .catch(error =>{
        console.log(error)
    })
    
}