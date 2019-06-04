// const csv = require('csv-parser')
const fs = require('fs')
const csv = require('csvtojson')
const ObjectsToCsv = require('objects-to-csv');


const allMeasurements = [];

const resultMeasurements = [];

var measurement;

var path = '/home/lucas/Documentos/Tesde_FINAL/100/1-UDP_e_TCP/'

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

const start = () => {
    fs.readdir(path, async function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        await asyncForEach(files, async function (file) {
            // Do whatever you want to do with the file

            const jsonArray = await csv().fromFile(path + file);

            allMeasurements.push(jsonArray)
        });

        var sum = 0;

        for ( i = 0; i < allMeasurements[0].length; i++){
            for (j = 0; j < allMeasurements.length; j++){
                if(!measurement){
                    measurement = allMeasurements[j][i]
                }
                else{
                    await asyncForEach(Object.keys(allMeasurements[j][i]),async function (key) {
                        if(key !== "Interval start"){
                            measurement[key] = parseFloat(measurement[key], 10) + parseFloat(allMeasurements[j][i][key], 10)
                        }
                    })
                }
                sum++
            }

            await asyncForEach(Object.keys(measurement),async function (key) {
                if(key !== "Interval start")
                    measurement[key] = parseFloat(measurement[key], 10) / sum
            })

            resultMeasurements.push(measurement)
            measurement = undefined
            sum = 0

        }

        // console.log(resultMeasurements);

        (async() =>{
            let csv = new ObjectsToCsv(resultMeasurements);

            // Save to file:
            await csv.toDisk('./test.csv');

            // Return the CSV file as string:
            console.log(await csv.toString());
        })();

    });
}

start()

// console.log("xx".equals( "xx"))