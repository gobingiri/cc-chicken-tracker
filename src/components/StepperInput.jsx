import React from 'react';

function StepperInput({ value, onChange, step = 1, min = 0 }) {
  const numericValue = Number(value) || 0;

  const handleDecrement = (e) => {
    e.preventDefault();
    const newValue = Math.max(min, numericValue - step);
    // Use toFixed to avoid floating point math errors like 0.25 - 0.25 = 0.00000001
    const fixedValue = Number.isInteger(step) ? newValue : parseFloat(newValue.toFixed(2));
    onChange(fixedValue);
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    const newValue = numericValue + step;
    const fixedValue = Number.isInteger(step) ? newValue : parseFloat(newValue.toFixed(2));
    onChange(fixedValue);
  };

  const handleChange = (e) => {
    const val = parseFloat(e.target.value);
    onChange(isNaN(val) ? '' : val);
  };

  return (
    <div className="custom-stepper">
      <button type="button" className="stepper-btn minus" onClick={handleDecrement}>−</button>
      <input 
        type="number" 
        value={value} 
        onChange={handleChange} 
        min={min} 
        step={step}
      />
      <button type="button" className="stepper-btn plus" onClick={handleIncrement}>+</button>
    </div>
  );
}

export default StepperInput;
