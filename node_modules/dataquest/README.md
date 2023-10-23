# Dataquest by willmil11
## Installation
```bash
npm install dataquest
```
## Usage
First import the module
```javascript
var dataquest = require("dataquest");
```
### Create a database
```javascript
var database = dataquest.createDatabase();
```
### Load a database
Syntax:
```javascript
dataquest.load(%path%);
```
Exemple:
```javascript
var database = dataquest.load("database.json");
```
### Save a database
Syntax:
```javascript
dataquest.save(%path%, %database%);
```
Exemple:
```javascript
dataquest.save("database.json", database);
```
### Set an item in the database
Syntax:
```javascript
database.set(%item%, %value%);
```
Exemple:
```javascript
database.set("item", "Value of item.");
```
### Get an item in the database
Syntax:
```javascript
database.get(%item%);
```
Exemple:
```javascript
var itemvalue = database.get("item");
```
### Delete an item in the database
Syntax:
```javascript
database.delete(%item%);
```
Exemple:
```javascript
database.delete("item");
```
## Changelog
### 1.0.0
- First release
## Future features
- [ ] Add encrypted databases
- [ ] Add a feature to share a database on multiple devices (Multiple devices containing little pieces of the same database to store more data)