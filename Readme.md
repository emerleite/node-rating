Node Rating
===========
Rating and Hit system

Dependencies
------------

### Runtime

* Node 0.4.x+
* express 1.0.7
* connect 0.5.7
* mongoose 1.0.10  (and MongoDB server)
* cluster 0.3.2 (optional)

### Tests
* nodeunit

Running
-------
### Normal
$ node server.js 

### Clustered
$ node cluster-server.js

### Usuage

Hit insert
$ curl -X POST http://localhost:3000/hit/:context/:subject/:id

Hit count for the current hour
$ curl http://localhost:3000/hit/:context/:subject/:id

Rate insert
$ curl -X POST http://localhost:3000/rate/:context/:subject/:id

Rate count

Running tests
-------------
$ nodeunit test
or
$ node run-tests

To-Do
-----
* URIs to consume totals
* Security key
* Code coverage

Author
------

* Emerson Macedo (<http://codificando.com/>)

License:
--------

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
