const express = require('express');
const http_tool = require ('xmlhttprequest').XMLHttpRequest;
var fs = require('fs');
var kgs_aggregator = require('kgs_results_aggregator');
const path = require('path');

const PORT = process.env.PORT || 8080;

const app = express(); 
var querier = new kgs_aggregator();

//serviamo in GET la root
app.get('/', (req, res) => {
    console.log('Homepage');
    fs.readFile('homepage.html', (err, data) => {
        res.write(data);
        res.end();
    });
    
});

app.get('/graphmode', (req, res) => {
    console.log('GraphMode');
    fs.readFile('graphmode.html', (err, data) => {
        res.write(data);
        res.end();
    });
});

//serviamo la ricerca brutale della keyword inserita (può essere anche un'espressione regolare)
app.get('/brutalSearch', (req, res) => {
    console.log('brutalSearch(express)');
    //url formatting
    const myURL = new URL(req.url, 'https://127.0.0.1:'+PORT);
    console.log(myURL);
    var keyword = myURL.searchParams.get('keyword');
    var rankingMode = myURL.searchParams.get('rankBy');
    var results = querier.brutalSearch(keyword, rankingMode);
    // for(var kg in results){
    //     if(results[kg].id == 'revyu')
    //         console.log(results[kg].pagerank);
    // }
    res.json(results);
    writeFile(results);
});

app.get('/multiTagSearch', (req, res) => {
    console.log('multiTagSearch(express');
    //url formatting
    const myURL = new URL(req.url, 'https://127.0.0.1:'+PORT);
    console.log(myURL);
    var keyword = myURL.searchParams.get('keyword');
    var rankingMode = myURL.searchParams.get('rankBy');
    var tags = myURL.searchParams.get('tags').split(',');
    var results = querier.multiTagSearch(keyword, ...tags, rankingMode);
  
    res.json(results);
    writeFile(results);
});

app.get('/checkAvailability', (req, res) => {
    console.log('check availability request');
    //url formatting
    const myURL = new URL(req.url, 'https://127.0.0.1:'+PORT);
    console.log(myURL);
    var targetSparql = myURL.searchParams.get('target');
    var request = new http_tool();
    request.open('GET', targetSparql, false);
    request.send();
    if(request.status == 200){
        console.log("devo inviare l'ok per l'availability");
        console.log(request.status);
        res.send(true);
    }else{
        console.log('questo end non funziona manco per il cazzo');
        console.log(request.status);
        res.send(false);
    }
});

app.get('/results.json', (req, res) => {
    console.log('mi hanno chiesto di scaricare i risultati ');    
    res.download('results.json');
})

app.get('/vivagraph.js', function (req, res, next) {
    res.sendFile(path.join(__dirname, '/vivagraph.js'))
})

app.get('/saveSvgAsPng.js', function (req, res, next) {
    res.sendFile(path.join(__dirname, '/saveSvgAsPng.js'))
})

app.listen(PORT, function(){
    console.log('sono in ascolto sulla porta 8080');
});

function writeFile(results){
    fs.writeFile("results.json", JSON.stringify(results, null, 2), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("results.json was saved");
    });
}