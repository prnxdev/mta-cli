# mta-cli
Command Line Interface for MTA

## Instalation
First you need NodeJS installed on your computer. Fastest way to do it?
On Windows install Chocolatey which is The Package Manager for Windows. If you have Chocolatey installed type in CMD:

```
choco install nodejs
```
**Note:** you can install NodeJS in any different way. I'm showing you only my favourite and I think fastest.

If you have NodeJS installed you can type in CMD:

```
npm i -g mta-cli
```

After that you get prompted to enter path to MTA server folder which is required because after that resource "resource-restart" will be copied to **resources** folder (which is in **resources** folder in this package repository) of your server and mtaserver.conf will be modified and "resource-restart" resource will be configured to start automatically after server start. This resource is required for `mta watch` command to work properly.

After instalation and configuration you will get **mta** command in your CMD (no matter if it's cmd.exe or PowerShell)

## Commands

### mta watch
Watches changes inside resource folder (must be used inside resource folder) and automatically restarts resource (can be executed only in resource folder).

### mta create <resourceName>
Creates resource folder with meta.xml and 2 .lua files fully configured.

### mta compile
Compiles all files from meta.xml to .luac files using luac_mta.exe and writes all compiled files into meta.xml (can be executed only in resource folder).

### mta settings
It's just debug. Returns JSON content of settings.json