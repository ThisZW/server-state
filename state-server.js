/**
 * State Server - Vistar Media Take-Home Puzzle!
 * Background:
    Vistar serves up a mound of geospatial data both internally and to third
    parties. What we need is a server to tell us which state, if any, a point is in.
    Some simplified geometries are included in states.json (so greatly simplified,
    that some of the smaller ones disappear).
 * Chris Huang
 * 9-28-2018
 */


const Flatten = require('flatten-js')
const {point, segment} = Flatten

const express = require('express')
const bodyParser = require("body-parser");
const app = express()

const states = require('./states.json')


/**
 * This function will sort all the given states by the 
 * distance between given point and the first given border of each state.
 * So the program will run to check the most possible states first.
 * @param states
 * @param input
 * @returns {Object[]}
 */
sortStatesByFirstBorderDistance = (states, input) => {
  //note that v.border[0][0] is for longitude and v.border[0][1] is for latitude
  states.sort((a, b)=>{
    getFirstBorderDistance = (state) => {
      let firstBorder = 
        segment(
          point(state.border[0][0], state.border[0][1]), 
          point(state.border[1][0], state.border[1][1]))
      return input.distanceTo(firstBorder)[0]
    }
    return getFirstBorderDistance(a) - getFirstBorderDistance(b)
  })
  return states;
}


/**
 * This function will loop all given borders of every states. For every border that has the same latitude 
 * as the given point && is located on the east side of the point will be counted. if the result is odd,
 * the selected state name will be returned as the final answer.
 * This function generally follows the even-odd rule, that the point is always inside the polygon if it will
 * intersect the edges in odd-number of times in one direction.
 * @param states array of json objects
 * @param input point object.
 * @returns {String} result state
 */
findPassingBordersOnTheRight = (states, input) => {
  //this will create a horizontal segment from input point to the atlantic ocean, we use this segment to check 
  //whether the borders intesect this line segment.
  let sortedStates = sortStatesByFirstBorderDistance(states, input);
  let result = 'This point does not belong to anywhere!!!'
  const segmentToAtlanticOcean = segment(input, point(-66, input.y))
  sortedStates.forEach( state=> {
    let borderCount = 0;
    let prevPoint;
    state.border.forEach((borderPoint, index) => {
      if(index !== 0){
        let currPoint = point(borderPoint[0], borderPoint[1])
        let border = segment(prevPoint, currPoint)
        segmentToAtlanticOcean.intersect(border).length && borderCount++
      }
      prevPoint = point(borderPoint[0], borderPoint[1])
    })
    borderCount%2 == 1 && (result = state.state)
  })
  return result
}


/**
 * Here is the main functions for express framework to work.
 */

const port = 8080

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/', (req, res)=>{
  let longitude = parseFloat(req.body.longitude)
  let latitude = parseFloat(req.body.latitude)
  let input = point(longitude, latitude)
  res.write(findPassingBordersOnTheRight(states, input))
  res.write('\n')
  res.end()
})

app.listen(port, () => console.log(`Port opened at ${port}!`))
