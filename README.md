# State Server!

What we need is a server to tell us which state, if any, a point is in.
Some simplified geometries are included in states.json (so greatly simplified,
that some of the smaller ones disappear).

It need not be fast, but the code should be readable, and the results should be
correct.

## Expected Behavior (Modified)

### Please have npm and nodejs installed in your system.
```
  $ npm i
  $ node state-server.js
    Port opened at 8080!
  $ curl  -d "longitude=-77.036133&latitude=40.513799" http://localhost:8080/
    Pennsylvania
```

## Notes

Given that file, it took one of us about an hour to implement something that
worked correctly. You're welcome to take it however far you want, but we're
expecting something along those lines.

And if there's anything special we have to do to run your program, just let us
know. A Makefile never hurt anyone.


## Some test datasets

```
$ curl  -d "longitude=-118.636440&latitude=36.207361" http://localhost:8080/
```
This should return "California"

```
$ curl  -d "longitude=-101.243205&latitude=31.479553" http://localhost:8080/
```
This should return "Texas"

```
$ curl  -d "longitude=-74.984396&latitude=42.552404" http://localhost:8080/
```
This should return "New York"
