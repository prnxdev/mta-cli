#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const process = require('process');
const chokidar = require('chokidar');
const program = require('commander');
const axios = require('axios');
const consola = require('consola');

program
	.command('watch')
	.action(() => {
		let resourceName = path.basename(path.resolve(process.cwd()));
		let options = {
			ignored: ['node_modules'],
			ignoreInitial: true
		};

		if (!fs.existsSync('./meta.xml')) throw Error('This is not resource folder. No meta.xml file found!');
		consola.info(`Watching changes for "${resourceName}" resource.`);

		chokidar
			.watch('.', options)
			.on('all', async (event, path) => {
				try {
					consola.info(`Restarting "${resourceName}"`);
					await axios.post('http://127.0.0.1:22005/resource-restart/call/restart', [resourceName]);
				} catch (error) {
					consola.error(error.message);			
				}
			});
	});

program
	.command('settings')
	.action(async (value) => {
		let settings = await fs.readFile('./settings.json');
		consola.info(JSON.parse(settings));
	});

program.parse(process.argv)

if (program.debug) console.log('spoko')