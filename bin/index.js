#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const process = require('process');
const chokidar = require('chokidar');
const program = require('commander');

program
    .command('watch')
    .action(() => {
        let resourceName = path.basename(path.resolve(process.cwd()));
        let options = {
            ignored: ['node_modules'],
            ignoreInitial: true
        };

        if (!fs.existsSync('./meta.xml')) throw Error('This is not resource folder. No meta.xml file found!');
       console.log(`Watching changes for "${resourceName}" resource.`);

        chokidar
            .watch('.', options)
            .on('all', (event, path) => {
                console.log("cos sie zrobilo");
            });
    });

program.parse(process.argv)

if (program.debug) console.log('spoko')