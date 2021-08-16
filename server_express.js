const express = require('express');
var fs = require('fs');
var lc_querier = require('lodcloud-querier');

const PORT = process.env.PORT || 8080;

const app = express(); 
var querier = new lc_querier();

//serviamo in GET la root
app.get('/', (req, res) => {
    console.log('Homepage');
    fs.readFile('index.html', (err, data) => {
        res.write(data);
        res.end();
    });
    
});

//serviamo la ricerca brutale della keyword inserita (può essere anche un'espressione regolare)
app.get('/brutalSearch', (req, res) => {
    console.log('devo cercare una keyword');
    //url formatting
    const myURL = new URL(req.url, 'https://127.0.0.1:'+PORT);
    console.log(myURL);
    var keyword = myURL.searchParams.get('keyword');
    var results = querier.brutalSearch(keyword);
    console.log(keyword);
    //per adesso inviamo la stessa key inserita, in seguito 
    // i risultati della ricerca su lod cloud/datahub o un aggregato di entrambi
    res.json(results);
});

app.listen(PORT, function(){
    console.log('sono in ascolto sulla porta 8080');
});