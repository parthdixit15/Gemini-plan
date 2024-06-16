import React, { useState } from 'react';
import './UserForm.css';

const UserForm = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [goal, setGoal] = useState('fat loss');
  const [dietPlan, setDietPlan] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { height, weight, heightUnit, goal };

    try {
      // Send form data to the backend
      const response = await fetch('http://localhost:3001/generate-diet-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setDietPlan(data.dietPlan);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="form-container">
      <h1>Information Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="height">Height:</label>
          <input
            type="text"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter height"
          />
          <select
            value={heightUnit}
            onChange={(e) => setHeightUnit(e.target.value)}
          >
            <option value="cm">cm</option>
            <option value="foot">foot</option>
          </select>
        </div>

        <div>
          <label htmlFor="weight">Weight (kg):</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight in kg"
          />
        </div>

        <div>
          <label htmlFor="goal">Goal:</label>
          <select
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            <option value="fat loss">Fat Loss</option>
            <option value="cut">Cut</option>
            <option value="bulking">Bulking</option>
            <option value="maingain">Maingain</option>
          </select>
        </div>

        <button type="submit"><span>Submit</span></button>
      </form>
      {dietPlan.length > 0 && (
        <div className='diet-plan-container'>
          {dietPlan.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserForm;
