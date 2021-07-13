import * as fs from "fs";
import { PingResponseSuccessData } from "src/interfaces/NetMonitor";

class Api {
    parsePingResponce(sResponse: string): PingResponseSuccessData {
        const regex = /([0-9]+) packets transmitted, ([0-9]+) received, ([0-9]{1,3}|[0-9]{1,3}\.[0-9]+)% packet loss, time [0-9]+ms\nrtt min\/avg\/max\/mdev = (([0-9]{1,3}\.[0-9]+)\/([0-9]{1,3}\.[0-9]+)\/([0-9]{1,3}\.[0-9]+)\/([0-9]{1,3}\.[0-9]+)) ms/gm
        const values = regex.exec(sResponse) as string[]
        const parsedResponse: PingResponseSuccessData = {
            transmitted: parseFloat(values[1]),
            received: parseFloat(values[2]),
            loss: parseFloat(values[3]),
            roundTrip: {
                min: parseFloat(values[5]),
                avg: parseFloat(values[6]),
                max: parseFloat(values[7]),
                mdev: parseFloat(values[8]),
            }
        }
        return parsedResponse
    };

    saveJSONtoFile(data: string, filename: string) {
        return new Promise<void>((resolve, reject) => {
            fs.writeFile(filename, data, 'utf8', function (err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    console.log(err);
                    reject(err)
                    return
                }
                resolve();
            });
        })
    }
    
    saveJSONtoFileSync(data: string, filename: string) {
        try {
            fs.writeFileSync(filename, data, 'utf8')
        } catch (err) {
            console.log("An error occured while writing JSON Object to File.");
            console.log(err);
            throw err
        }
    }
}

const api = new Api

export default api