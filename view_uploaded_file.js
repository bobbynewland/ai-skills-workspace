const firebase = require('firebase/app');
require('firebase/database');

const firebaseConfig = {
    apiKey: "AIzaSyAVmSmiuJDcCAiZhq3xqXSJZnWtviLvnuU",
    databaseURL: "https://winslow-756c3-default-rtdb.firebaseio.com",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

async function getFile() {
    const snapshot = await db.ref('workspaces/winslow_main/files').orderByChild('uploadedAt').limitToLast(1).once('value');
    const files = snapshot.val();
    if (files) {
        const fileId = Object.keys(files)[0];
        const file = files[fileId];
        console.log('File found:', file.name);
        console.log('Type:', file.type);
        console.log('Size:', file.size);
        // Save base64 data to file
        const fs = require('fs');
        const base64Data = file.data.replace(/^data:image\/png;base64,/, '');
        fs.writeFileSync('/tmp/' + file.name, base64Data, 'base64');
        console.log('Saved to: /tmp/' + file.name);
    }
    process.exit(0);
}

getFile().catch(console.error);
