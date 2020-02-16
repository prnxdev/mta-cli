#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const process = require('process');
const chokidar = require('chokidar');
const program = require('commander');
const axios = require('axios');
const consola = require('consola');
const unzip = require('node-unzip-2');
const xml2js = require('xml2js');
const { exec } = require('child_process');

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
	.command('create <resourceName>')
	.action(async (resourceName) => {
		try {
			let currentPath = process.cwd();
			let resourceDirPath = `${currentPath}/${resourceName}`;
			if (fs.existsSync(resourceDirPath)) throw new Error(`Folder with name "${resourceName}" exists in current directory. Choose different name.`);
			consola.info(`Creating ${resourceName} resource...`);
			await fs.copyFile(__dirname + '/../resources/example-resource.zip', `${resourceDirPath}.zip`);
			fs.createReadStream(`${resourceDirPath}.zip`)
				.pipe(unzip.Extract({ path: resourceDirPath }));
			fs.remove(`${resourceDirPath}.zip`);
			consola.info(`Resource created at ${resourceDirPath}`);	
		} catch (error) {
			consola.error(error.message);			
		}
	});

program
	.command('compile')
	.action(async () => {
		try {
			let currentPath = process.cwd();
			let metaPath = `${currentPath}/meta.xml`;
			let outputString = '';
			if (!fs.existsSync(metaPath)) throw Error('This is not resource folder. No meta.xml file found!');
			let metaString = await fs.readFile(metaPath);
			xml2js.parseString(metaString, async (err, result) => {
				result.meta.script.map(script => {
					script = script['$'];
					consola.info(`Compiling ${script.src}...`);
					exec(__dirname + `/luac_mta.exe -e3 -o "${currentPath}/dist/${script.src}c" "${currentPath}/${script.src}"`);
					let compiledIndex = result.meta.script.map(e => e['$']).findIndex(e => e.src === `dist/${script.src}c`);
					if (compiledIndex === -1) {
						result.meta.script.push({'$': { src: `dist/${script.src}c`, type: script.type }});
					}
				});
				outputString = result;
			});

			let builder = new xml2js.Builder();
			let xml = builder.buildObject(outputString);
			await fs.writeFile(metaPath, xml);
			consola.info(`All compiled files were added to meta.xml file. Enjoy!`);
		} catch (error) {
			consola.error(error);
		}
	});

program
	.command('settings')
	.action(async (value) => {
		let settings = await fs.readFile('./settings.json');
		consola.info(JSON.parse(settings));
	});

program.parse(process.argv)

if (program.debug) console.log('spoko')