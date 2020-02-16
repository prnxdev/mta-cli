const inquirer = require('inquirer');
const consola = require('consola');
const fs = require('fs-extra');
const xml2js = require('xml2js');

consola.info('We need more informations. Please, answer questions listed below:');

inquirer
  .prompt([
    { name: 'serverPath', message: 'Enter the path to MTA server folder:', type: 'input' }
  ])
  .then(async (answers) => {
    try {
      consola.info('Saving settings data...');
      await fs.writeFile('./settings.json', JSON.stringify(answers));
      consola.info('Copying resource-restart resource to resources folder...');
      await fs.copyFile('./resources/resource-restart.zip', `${answers.serverPath}/mods/deathmatch/resources/resource-restart.zip`);
      consola.info('Adding resource-restart to server config...');
      let serverConfigString = await fs.readFile(`${answers.serverPath}/mods/deathmatch/mtaserver.conf`);
      xml2js.parseString(serverConfigString, async (err, result) => {
        result.config.resource = result.config.resource || [];
        let index = result.config.resource.map(res => res['$']).findIndex(res => res.src === 'resource-restart');
        if (index === -1) {
          result.config.resource.push({'$': {src: 'resource-restart', startup: '1', protected: '0'}});
          let builder = new xml2js.Builder();
          let xml = builder.buildObject(result);
          await fs.writeFile(`${answers.serverPath}/mods/deathmatch/mtaserver.conf`, xml);
        }
      });
    } catch (error) {
      consola.error(error);      
    }
  });