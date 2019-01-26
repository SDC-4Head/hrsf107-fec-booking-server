const express = require('express');
const request = require('superagent');
const bodyParser = require('body-parser');
// const PORT = process.env.PORT;

require('newrelic');

const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT;

import path from 'path';

const app = express();
const client = redis.createClient('6379','127.0.0.1');

app.use(express.static(path.join(__dirname, './../client/dist')));

const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/rooms/:id', (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const insertBooking = 'INSERT INTO booking.hotels(hotelfk, startdate, enddate) VALUES ($1, $2, $3)';
    const queryParams = [id, payload.startDate, payload.endDate];
    pool.query(insertBooking, queryParams, (err, success) => {
        if (err) {
            res.status(500)
                .send(err);
        } else {
            res.status(201)
                .send(success);
        }
    });
})

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/../client/dist/index.html'));
});

client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

client.set('my test key', 'my test value', redis.print);
client.get('my test key', function (error, result) {
    if (error) {
        console.log(error);
        throw error;
    }
    console.log('GET result ->' + result);
});

class Node {
    constructor(key, value, next = null, prev = null) {
        this.key = key;
        this.value = value;
        this.next = next;
        this.prev = prev;
    }
}

class LRU {

    constructor(limit = 20) {
        this.size = 0;
        this.limit = limit;
        this.head = null;
        this.tail = null;
        this.cache = {};
    }

    // Write to head of LinkedList
    write(key, value){
        this.ensureLimit();

        if(!this.head){
            this.head = this.tail = new Node(key, value);
        }else{
            const node = new Node(key, value, this.head.next);
            this.head.prev = node;
            this.head = node;
        }

        //Update the cache map
        this.cache[key] = this.head;
        this.size++;
    }

    // Read from cache map and make that node as new Head of LinkedList
    read(key){
        if(this.cache[key]){
            const value = this.cache[key].value;
            const node = new Node(key, value);

            // node removed from it's position and cache
            this.remove(key)
            this.write(key, value);

            return value;
        }

        console.log(`Item not available in cache for key ${key}`);
    }

    ensureLimit(){
        if(this.size === this.limit){
            this.remove(this.tail.key)
        }
    }

    remove(key){
        const node = this.cache[key];

        if(node.prev !== null){
            node.prev.next = node.next;
        }else{
            this.head = node.next;
        }

        if(node.next !== null){
            node.next.prev = node.prev;
        }else{
            this.tail = node.prev
        }

        delete this.cache[key];
        this.size--;
    }

    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.cache = {};
    }

    // Invokes the callback function with every node of the chain and the index of the node.
    forEach(fn) {
        let node = this.head;
        let counter = 0;
        while (node) {
            fn(node, counter);
            node = node.next;
            counter++;
        }
    }

    // To iterate over LRU with a 'for...of' loop
    *[Symbol.iterator]() {
        let node = this.head;
        while (node) {
            yield node;
            node = node.next;
        }
    }
}

app.listen(PORT, () => {
    console.log('Proxy server up and listening on port ' + PORT)
});