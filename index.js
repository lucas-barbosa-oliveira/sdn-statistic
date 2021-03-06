const fs = require('fs');
const csv = require('csvtojson');
const ObjectsToCsv = require('objects-to-csv');
const makeDir = require('make-dir');
const del = require('delete');

var pathName = '/home/lucas/Documentos/Mestrado/estrutura_dos_testes/'

var folders =
    [
        '100/1-UDP_e_TCP/com_sdn/bandwidth/dispositivos/',
        '100/1-UDP_e_TCP/com_sdn/bandwidth/protocolos/',
        '100/1-UDP_e_TCP/com_sdn/package/dispositivos/',
        '100/1-UDP_e_TCP/com_sdn/package/protocolos/',
        '100/1-UDP_e_TCP/com_sdn/gerais/dicom/',
        '100/1-UDP_e_TCP/com_sdn/gerais/dispositivos_medicos/',
        '100/1-UDP_e_TCP/com_sdn/gerais/geral/',
        '100/1-UDP_e_TCP/com_sdn/gerais/servidor_udp/',
        '100/1-UDP_e_TCP/com_sdn/gerais/tcp/',
        '100/1-UDP_e_TCP/com_sdn/gerais/udp/',

        '100/1-UDP_e_TCP/sem_sdn/bandwidth/dispositivos/',
        '100/1-UDP_e_TCP/sem_sdn/bandwidth/protocolos/',
        '100/1-UDP_e_TCP/sem_sdn/package/dispositivos/',
        '100/1-UDP_e_TCP/sem_sdn/package/protocolos/',
        '100/1-UDP_e_TCP/sem_sdn/gerais/dicom/',
        '100/1-UDP_e_TCP/sem_sdn/gerais/dispositivos_medicos/',
        '100/1-UDP_e_TCP/sem_sdn/gerais/geral/',
        '100/1-UDP_e_TCP/sem_sdn/gerais/servidor_udp/',
        '100/1-UDP_e_TCP/sem_sdn/gerais/tcp/',
        '100/1-UDP_e_TCP/sem_sdn/gerais/udp/',

        '100/2-UDP_e_UDP/com_sdn/bandwidth/',
        '100/2-UDP_e_UDP/com_sdn/package/',
        '100/2-UDP_e_UDP/com_sdn/gerais/chamadas_voip/',
        '100/2-UDP_e_UDP/com_sdn/gerais/dispositivos_medicos/',
        '100/2-UDP_e_UDP/com_sdn/gerais/geral/',
        '100/2-UDP_e_UDP/com_sdn/gerais/servidor_udp/',

        '100/2-UDP_e_UDP/sem_sdn/bandwidth/',
        '100/2-UDP_e_UDP/sem_sdn/package/',
        '100/2-UDP_e_UDP/sem_sdn/gerais/chamadas_voip/',
        '100/2-UDP_e_UDP/sem_sdn/gerais/dispositivos_medicos/',
        '100/2-UDP_e_UDP/sem_sdn/gerais/geral/',
        '100/2-UDP_e_UDP/sem_sdn/gerais/servidor_udp/',



        '500/1-UDP_e_TCP/com_sdn/bandwidth/dispositivos/',
        '500/1-UDP_e_TCP/com_sdn/bandwidth/protocolos/',
        '500/1-UDP_e_TCP/com_sdn/package/dispositivos/',
        '500/1-UDP_e_TCP/com_sdn/package/protocolos/',
        '500/1-UDP_e_TCP/com_sdn/gerais/dicom/',
        '500/1-UDP_e_TCP/com_sdn/gerais/dispositivos_medicos/',
        '500/1-UDP_e_TCP/com_sdn/gerais/geral/',
        '500/1-UDP_e_TCP/com_sdn/gerais/servidor_udp/',
        '500/1-UDP_e_TCP/com_sdn/gerais/tcp/',
        '500/1-UDP_e_TCP/com_sdn/gerais/udp/',

        '500/1-UDP_e_TCP/sem_sdn/bandwidth/dispositivos/',
        '500/1-UDP_e_TCP/sem_sdn/bandwidth/protocolos/',
        '500/1-UDP_e_TCP/sem_sdn/package/dispositivos/',
        '500/1-UDP_e_TCP/sem_sdn/package/protocolos/',
        '500/1-UDP_e_TCP/sem_sdn/gerais/dicom/',
        '500/1-UDP_e_TCP/sem_sdn/gerais/dispositivos_medicos/',
        '500/1-UDP_e_TCP/sem_sdn/gerais/geral/',
        '500/1-UDP_e_TCP/sem_sdn/gerais/servidor_udp/',
        '500/1-UDP_e_TCP/sem_sdn/gerais/tcp/',
        '500/1-UDP_e_TCP/sem_sdn/gerais/udp/',

        '500/2-UDP_e_UDP/com_sdn/bandwidth/',
        '500/2-UDP_e_UDP/com_sdn/package/',
        '500/2-UDP_e_UDP/com_sdn/gerais/chamadas_voip/',
        '500/2-UDP_e_UDP/com_sdn/gerais/dispositivos_medicos/',
        '500/2-UDP_e_UDP/com_sdn/gerais/geral/',
        '500/2-UDP_e_UDP/com_sdn/gerais/servidor_udp/',

        '500/2-UDP_e_UDP/sem_sdn/bandwidth/',
        '500/2-UDP_e_UDP/sem_sdn/package/',
        '500/2-UDP_e_UDP/sem_sdn/gerais/chamadas_voip/',
        '500/2-UDP_e_UDP/sem_sdn/gerais/dispositivos_medicos/',
        '500/2-UDP_e_UDP/sem_sdn/gerais/geral/',
        '500/2-UDP_e_UDP/sem_sdn/gerais/servidor_udp/',
]

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

function readFile(path) {

    var allMeasurements = [];

    return new Promise((resolve,reject) => {
        fs.readdir(path, async function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }

            if(files.length === 0)
                return console.log('There are not files in directory!');


            //listing all files using forEach
            asyncForEach(files, async function (file) {
                // Do whatever you want to do with the file

                if (file.indexOf(".txt") === -1)
                    return //console.log('It\'s not in txt format!');

                const jsonArray = await csv().fromFile(path + file);

                allMeasurements.push(jsonArray)
            }).then(() => {
                return resolve(allMeasurements)
            }).catch((err) => {
                return reject(err.message);
            });
        });
    });

}

async function measurementsAverage(allMeasurements) {
    var sum = 0;
    var measurement;
    var resultMeasurements = [];


    var limitRow = allMeasurements[0].length;

    if (allMeasurements[0].length > 150){
        limitRow = 150;
    }

    for (var i = 0; i < limitRow; i++) {
        for (var j = 0; j < allMeasurements.length; j++) {
            if (!measurement) {
                measurement = allMeasurements[j][i]
            } else {
                await asyncForEach(Object.keys(allMeasurements[j][i]), async function (key) {
                    if (key !== "Interval start") {
                        measurement[key] = parseFloat(measurement[key], 10) + parseFloat(allMeasurements[j][i][key], 10)
                    }
                }).catch((err) => {
                    console.log(err)
                    console.log('i: ' + i + ', j: ' + j)
                })
            }
            sum++
        }

        await asyncForEach(Object.keys(measurement), async function (key) {
            if (key !== "Interval start")
                measurement[key] = parseFloat(measurement[key], 10) / sum
        })

        resultMeasurements.push(measurement)
        measurement = undefined
        sum = 0


    }
    return  resultMeasurements;

}

function saveFile(path, resultMeasurements) {
    del.sync(path +'measurementsAverage.csv', {force: true});

    (async () => {
        let csv = new ObjectsToCsv(resultMeasurements);

        // Save to file:
        await csv.toDisk(path +'measurementsAverage.csv');

        // Return the CSV file as string:
        await csv.toString();

        console.log('Generated file measurementsAverage.csv in ' + path )
    })();
}

async function createDirectories() {

    await asyncForEach(folders, async function (folder) {
        if (!fs.existsSync(pathName + folder)) {
            const path = await makeDir(pathName + folder);
            console.log(path);
        }
    })

}

async function readDirectories() {
    await asyncForEach(folders, async function (folder) {
        readFile(pathName + folder).then(async (allMeasurements) => {
            var resultMeasurements = await measurementsAverage(allMeasurements);
            await saveFile(pathName + folder, resultMeasurements);
        }).catch((err) => {
            console.log(err)
        })
    })
}

const start = async () => {

    await createDirectories()

    await readDirectories()
}

start()
