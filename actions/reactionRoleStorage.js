const fs = require("fs");
const dataFilePath = "./data/reactionrole.json";

let reactionRoleData;

const getData = async () => {
    return new Promise((resolve, reject) => {
        if (reactionRoleData) return resolve(reactionRoleData);
        fs.readFile(dataFilePath, 'utf8', (err, data) => {
            if (err) {
                reject(`Error reading reactionrole data: ${err}`);
            }
            if (!data) {
                reactionRoleData = [];
                saveData();
            } else {
                reactionRoleData = JSON.parse(data);
            }
            resolve(reactionRoleData);
        });
    })
}

const addData = async (data) => {
    if (!('messageId' in data && 'roles' in data)) {
        console.log('tried to save invalid reactionrole data');
        return;
    }
    // Load data if not cached
    if (!reactionRoleData) {
        try {
            reactionRoleData = await getData();
        } catch (e) {
            console.log(e);
            return;
        }
    }
    // Add new data
    reactionRoleData.push(data);
    saveData();
}

const saveData = () => {
    fs.writeFile(dataFilePath, JSON.stringify(reactionRoleData), (err) => {
        if (err) {
            console.log(`Error writing reactionrole data: ${err}`)
        }
    })
}

module.exports = {
    getData,
    addData,
}