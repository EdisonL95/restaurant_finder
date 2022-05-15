import React, { useState } from 'react';
import './App.css';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

function App() { 
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
  const [textInput, setTextInput] = useState("");
  const [restaurantInfo, setRestaurants] = useState([]);
  const [pageToken, setPageToken] = useState("");

  function getCurrLocation()
  {
    navigator.geolocation.getCurrentPosition(
      position => {
        getRestaurant(position.coords.latitude, position.coords.longitude)
      },
      error => {
        this.setState({
          error: 'Error Getting Weather Condtions'
        });
      }
    );
  }

  async function getInputLocation()
  {
    const encodedAddress = encodeURI(textInput)
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${API_KEY}`);
      const json_data = await response.json();
      const lat = json_data.results[0].geometry.location.lat
      const long = json_data.results[0].geometry.location.lng
      getRestaurant(lat, long)
    }
    catch (e){
      alert("Please enter a valid address")
    }
  }

  async function getRestaurant(lat, long) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=1500&type=restaurant&key=${API_KEY}`);
    const json_data = await response.json();
    const array = [];
    setPageToken(json_data.next_page_token);
    for (var i = 0; i < json_data.results.length; i++){
      array.push({name: "Name: " + json_data.results[i].name, id: "\nAddress: " + json_data.results[i].vicinity, rating: "\nRating: " + json_data.results[i].rating})
    }
    setRestaurants(array);
  }

  async function loadMore(){
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${pageToken}&key=${API_KEY}`);
    const json_data = await response.json();
    const array = restaurantInfo;
    for (var i = 0; i < json_data.results.length; i++){
      array.push({name: "Name: " + json_data.results[i].name, id: "\nAddress: " + json_data.results[i].vicinity, rating: "\nRating: " + json_data.results[i].rating})
    }
    setRestaurants(array);
    setPageToken(json_data.next_page_token);
  }

  let loadMoreButton = "";
  if (pageToken){
    loadMoreButton = <Button variant="primary" onClick={loadMore} id="button">Load More Restaurants</Button>;
  }

  function inputChange(event) { setTextInput(event.target.value); } 

  return (
    <div className="App" class="body">
      <div class="container bg-dark">
        <header>
          <h1>React Restaurant Finder</h1>
        </header>
        <span>Input location: </span> <br></br>
        <input type="text" value = {textInput} onChange={inputChange}></input> <br></br>
        <Button variant="primary" onClick={getCurrLocation} id="button">Get Restaurants Near Input Location</Button>
        <Button variant="primary" onClick={getCurrLocation} id="button">Get Restaurants Near Current Location</Button>
      </div>
      <div class="container bg-secondary">
        {restaurantInfo.map((restaurant) => // Map through the items to display them in an unordered list with the description, a delete text button and an edit text button
          <div class = "results" key={restaurant.id}>
              {restaurant.name} <br></br>
              {restaurant.id} <br></br>
              {restaurant.rating}
          </div>)}
          {loadMoreButton}
      </div>
    </div>
  );
}

export default App;
