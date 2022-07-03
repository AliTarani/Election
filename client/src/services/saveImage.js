import httpService from "./httpService"


export function SaveImage(data) {
    httpService.post("http://localhost:8999/upload", data, { // receive two parameter endpoint url ,form data 
    })
    .then(res => { // then print response status
        console.log(res.statusText)
    })
}

export default{
    SaveImage
}