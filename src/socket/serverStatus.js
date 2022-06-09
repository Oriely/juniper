/**
 * 
 * @typedef { import('socket.io').Server } io 
 */

const os = require('os');
const osu = require('node-os-utils');



function status() {
    const totalMemoryMB = os.totalmem();
    const totalMemoryGB = os.totalmem() / 1000;
    const freeMemory = os.freemem();
    const memoryUsage = ((freeMemory - totalMemoryMB) / totalMemoryMB) * 100;

    const status = {
        cpus: os.cpus(),
        totalMemoryMB: totalMemoryMB,
        totalMemoryGB: totalMemoryGB,
        freeMemory: freeMemory,
        memoryUsage: memoryUsage
    }
    return status;
}


/**
 * 
 * @param {io} io 
 */
module.exports = function(io) {

    let ticker = null;

    io.on('connection', (socket) => {
        if(io.engine.clientsCount === 1) {
            console.log('Starting os status ticker.')
            ticker = setInterval(async () => {
                const status2 = async () => {
                    const cpuData = await osu.cpu.usage();
                    const memData = await osu.mem.info();
                    const dataObj = {
                        memory: memData,
                        cpu: cpuData
                    }
                    return dataObj
                }

                const data = await status2();
                io.emit('osstatus', data);
            }, 500);

           ;
        }
        socket.on('disconnect', () => {
            if(io.engine.clientsCount === 0) {
                console.log('Stopping os status ticker.')
                clearInterval(ticker);
            }
        }) 
    });

}