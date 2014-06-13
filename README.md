Block Timer
===========

A node.js timer implementation for timing blocks of code that are run one or more times.

This is useful to discover how long certain blocks of your code take, and / or how many times they are run, without specifically being tied to certain functions or your stack trace.


## Installation

```
npm install --save block-timer
```

## Usage

Create a `new Timer()` instance and then start and stop named timer blocks on it.

When you are done, call `timer.log()`, output `timer.toString()` or simply `console.log(timer)` to see the results.

Each named timer block can be run multiple times in one of two modes:

*	sequentially (start, stop, start, stop...)
*	in parallel (each run is given an id)

When a timer is run multiple times, the total number of timers run, total time taken and average timer per run will be displayed in the results.

*Remember that parallel timers may run at the same time, which will result in overlap when calculating the total time taken; i.e. 5 timers running at the same time for 1 second each will add up to 5 seconds total, when the real time elapsed is 1 second*

If a named block is run sequentially and started while already running, or stopped while not running, an error will be thrown.

You cannot mix sequential and parallel modes for a single named timer block.

### Creating a Timer Instance

*Assume there's something that takes 1ms after each timer start*

```
var Timer = require('block-timer');
var timer = new Timer();
// or
var timer = Timer.create();
```

### Sequential Timers

```
timer.start('block 1');
for (var i = 0; i <= 5; i++) {
	timer.start('block 2');
	timer.stop('block 2');
}
timer.stop('block 1');
console.log(timer);
```

Will display:

```
TIMER RESULTS:
*   block 1: 6ms
*   block 2: 5 x 1ms = 5ms
```

### Parallel Timers

*Assume there's something async that takes 1ms after each timer start*

```
timer.start('block 1');
for (var i = 0; i < 5; i++) {
	timer.start('block 2', i);
}
for (var i = 0; i < 5; i++) {
	timer.stop('block 2', i);
}
timer.stop('block 1');
console.log(timer);
```

Will display:

```
TIMER RESULTS:
*   block 1: 2ms
*   block 2: 5 x 1ms = 5ms
```

### Disabling the Timer

You can disable the timer by calling `timer.stub()` or by using an instance of `new Timer.Stub()` instead.

This provides an easy way of removing the timer and any overhead it creates, without actually commenting it out or removing it from your code.


## API

`new Timer()` or `Timer.create()` returns a new **Timer** instance

`timer.start(name)` starts (or restarts) a sequential timer

`timer.start(name, id)` starts a parallel timer by id

`timer.stop(name)` stops a sequential timer

`timer.stop(name, id)` stops a parallel timer by id

`timer.toString()` returns the formatted results of all timers

`timer.log()` logs the formatted results to the console


### Stub API

`new Timer.Stub()` or `Timer.stub()` returns a new **Timer.Stub** instance

`timer.stub()` replaces all methods with stubs in an existing Timer instance

Stubs match the real `Timer` API but do nothing, except for `stub.toString()` which returns an empty string.


License
=======

The MIT License (MIT)

Copyright (c) 2014 Jed Watson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

