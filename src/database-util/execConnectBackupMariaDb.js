const { MongoClient } = require('mongodb');
const fs = require('fs');
async function execConnectBackupMongo(mongodbURI, tempBackupDir) {


    const client = new MongoClient(mongodbURI);

    try {

        // Executar o comando de backup forma antiga com mongodump (não recomendado)
        // const backupCommand = `mongodump --uri="${mongodbURI}" --out=${tempBackupDir}`;
        // await execCommand(backupCommand, 'MongoDB Dump');

        await client.connect();

        const database = client.db(); // ou especifique o nome do banco de dados: client.db('<nome_do_banco_de_dados>');

        const collections = await database.listCollections().toArray();

        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            const backupData = await database.collection(collectionName).find().toArray();

            const backupFilePath = `${tempBackupDir}/${collectionName}.json`;
            fs.writeFileSync(backupFilePath, JSON.stringify(backupData));
            console.log(`Backup da coleção ${collectionName} realizado com sucesso em ${backupFilePath}`);
        }

        console.log('Backup de todas as coleções realizado com sucesso!');
    } catch (error) {
        console.error('Erro ao fazer backup:', error);
    } finally {
        await client.close();
    }
}


exports.execConnectBackupMongo = execConnectBackupMongo;