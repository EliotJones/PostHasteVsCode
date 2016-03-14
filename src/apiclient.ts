import * as http from 'http';
import { copyReturnedUrl } from './posthaste';

var options = {
    host: "hastebin.com",
    path: "/documents",
    method: "POST"
}

export function tryUpload(text: string, language: string) {
    var request = http.request(options, function (response: http.IncomingMessage) {
        response.setEncoding("utf8");
        response.on("data", function (data) {
            copyReturnedUrl(JSON.parse(data).key, language);
        })
    });
    
    request.on("error", function (e) {
        throw e;        
    });
    
    request.write(text);
    request.end();  
}