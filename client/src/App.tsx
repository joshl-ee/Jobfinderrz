import React, { useState, ChangeEvent } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [phoneNumber, setPhoneNumber] = useState<string>(''); // Define a state variable for the phone number with a type of string

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value); // Update the phone number state when the input value changes
  };

  const handleButtonClick = () => {
    registerUser(phoneNumber); // Call your callback function with the phone number when the button is clicked
  };

  const registerUser = (number: string) => {
    console.log('Phone number: ', number); // Do something with the phone number
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to JobFinderrz! Enter in your phone number to get notified of new job postings from the top tech companies.
        </p>
        <label>
          Phone Number
          <input
              type="tel"
              name="phone-number"
              className="Phone-number-input"
              value={phoneNumber} // Bind the input value to the phone number state
              onChange={handlePhoneNumberChange} // Update the state when the input changes
            />
          </label>
        <div className="Button-container">
          <button className="Submit-button" onClick={handleButtonClick}>Submit</button> {/* Call handleButtonClick when the button is clicked */}
        </div>
      </header>
    </div>
  );
}

export default App;
