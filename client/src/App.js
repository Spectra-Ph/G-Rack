//importing react-places-autocomplete
import { useState, useEffect } from "react";
import PlacesAutocomplete from 'react-places-autocomplete';
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';

const API_BASE = "http://localhost:3001";

// External font link can be placed in the index.html or App.css

function App() {
  const [gyms, setGyms] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newGym, setNewGym] = useState("");
  const [newGymCoordinates, setNewGymCoordinates] = useState(null); // State to store the coordinates

  useEffect(() => {
    GetGyms();
  }, []);

  const GetGyms = () => {
    fetch(API_BASE + "/gym")
      .then(res => res.json())
      .then(data => setGyms(data))
      .catch(err => console.error("Error: ", err));
  }

  const addGym = async () => {
    // Use the newGymCoordinates state to store the coordinates along with the gym name
    console.log('Data sent:', { text: newGym, latitude: newGymCoordinates?.lat, longitude: newGymCoordinates?.lng });
    const data = await fetch(API_BASE + "/gym/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: newGym,
        latitude: newGymCoordinates ? newGymCoordinates.lat : 0,
        longitude: newGymCoordinates ? newGymCoordinates.lng : 0,
  
      })
    }).then(res => res.json());

    setGyms([...gyms, data]);
    setPopupActive(false);
    setNewGym("");
    setNewGymCoordinates(null); // Reset the coordinates after adding the gym
  }

  const handleSelect = async (value) => {
    // Get the coordinates when a location is selected
    try {
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);
      setNewGym(value);
      setNewGymCoordinates(latLng);
      console.log('Selected coordinates:', latLng);
    } catch (error) {
      console.error('Error fetching coordinates: ', error);
    }
  };

  return (
    <div className="App">
      <h1 className="G-Rack">G-Rack</h1>
      <h4>Your gyms</h4>
      <div className="gyms">
        {gyms.map(gym => (
          <div className="gym" key={gym.id}>{gym.text}</div>
        ))}
      </div>

      <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>

      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>x</div>
          <div className="content">
            <h3>Add Gym</h3>
            <PlacesAutocomplete
              value={newGym}
              onChange={setNewGym}
              onSelect={handleSelect}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <input
                    {...getInputProps({
                      placeholder: 'Enter a gym name...',
                      className: 'add-gym-input',
                    })}
                  />
                  <div>
                    {loading ? <div>Loading...</div> : null}

                    {suggestions.map(suggestion => {
                      const style = {
                        backgroundColor: suggestion.active ? '#41b6e6' : '#fff',
                        color: suggestion.active ? '#000' : '#000',
                      };
                      return (
                        <div {...getSuggestionItemProps(suggestion, { style })}>
                          {suggestion.description}
                        </div>
                      );
                    })}

                  </div>
                </div>
              )}
            </PlacesAutocomplete>
            <div className="coordinates">
  {newGymCoordinates && (
    <div>
      Latitude: {newGymCoordinates.lat}, Longitude: {newGymCoordinates.lng}
    </div>
  )}
</div>
            
            <div className="button" onClick={addGym}>Enter</div>
          </div>
        </div>
      ) : ''}
    </div>
  );
}

export default App;
//<div className="coordinates"> {/* This is where it should go */}
       /* {newGymCoordinates && (
          <div>
            Latitude: {newGymCoordinates.lat}, Longitude: {newGymCoordinates.lng}
          </div>
        )}*/
//      </div>
