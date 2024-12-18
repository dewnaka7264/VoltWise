import React, { useState } from "react";
import "./App.css";

function App() {
  const [appliances, setAppliances] = useState([]);
  const [newAppliance, setNewAppliance] = useState({
    name: "",
    quantity: 1,
    power: 0,
    hours: 1,
  });

  const [totalUnits, setTotalUnits] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [recommendedInverter, setRecommendedInverter] = useState("");
  const [houseLoad, setHouseLoad] = useState(0); // Updated calculation for house load

  const applianceDefaults = [
    { name: "Air Conditioner", power: 2.5 },
    { name: "Clothes Iron", power: 1.5 },
    { name: "Clothes Dryer", power: 2.0 },
    { name: "Dishwasher", power: 1.2 },
    { name: "Electric Kettle", power: 1.8 },
    { name: "Fan Heater", power: 2.0 },
    { name: "Microwave Oven", power: 1.2 },
    { name: "Desktop Computer", power: 0.2 },
    { name: "Laptop Computer", power: 0.05 },
    { name: "Fridge", power: 0.15 },
    { name: "TV", power: 0.1 },
    { name: "Vacuum Cleaner", power: 1.0 },
  ];

  const handleApplianceSelect = (e) => {
    const selectedAppliance = applianceDefaults.find(
        (item) => item.name === e.target.value
    );
    if (selectedAppliance) {
      setNewAppliance({
        ...newAppliance,
        name: selectedAppliance.name,
        power: selectedAppliance.power,
      });
    }
  };

  const addAppliance = () => {
    if (
        newAppliance.name &&
        newAppliance.quantity > 0 &&
        newAppliance.power > 0 &&
        newAppliance.hours > 0
    ) {
      setAppliances([...appliances, newAppliance]);
      setNewAppliance({ name: "", quantity: 1, power: 0, hours: 1 });
    }
  };

  const calculateTotals = () => {
    // Calculate house load in kW
    const totalLoad = appliances.reduce(
        (total, appliance) => total + appliance.quantity * appliance.power,
        0
    );

    // Calculate monthly units (kWh)
    const units = appliances.reduce(
        (total, appliance) =>
            total + appliance.quantity * appliance.power * appliance.hours * 30,
        0
    );

    // Calculate total cost based on monthly units
    let cost = 0;
    if (units <= 68) cost = units * 15;
    else if (units <= 102) cost = 68 * 15 + (units - 68) * 18;
    else cost = 68 * 15 + 34 * 18 + (units - 102) * 30;

    // Calculate the recommended inverter capacity in watts
    const recommendedInverterValue = totalLoad * 1.7 * 1000; // Add 70% margin and convert to watts

    setHouseLoad(totalLoad.toFixed(2)); // Set house load (kW)
    setTotalUnits(units.toFixed(2)); // Set total units (kWh)
    setTotalCost(cost.toFixed(2)); // Set total cost (LKR)
    setRecommendedInverter(`${recommendedInverterValue.toFixed(0)} W`);
  };

  return (
      <div className="App">
        <h1>Electricity Load Calculator</h1>

        {/* Dropdown for default appliances */}
        <div className="input-section">
          <h3>Add Appliance</h3>
          <label>Select Default Appliance: </label>
          <select value={newAppliance.name} onChange={handleApplianceSelect}>
            <option value="">-- Choose Appliance --</option>
            {applianceDefaults.map((appliance, index) => (
                <option key={index} value={appliance.name}>
                  {appliance.name} ({appliance.power} kW)
                </option>
            ))}
          </select>

          <p style={{ margin: "10px 0", fontWeight: "bold" }}>OR</p>

          {/* Manual Entry Fields */}
          <input
              type="text"
              placeholder="Appliance Name"
              value={newAppliance.name}
              onChange={(e) =>
                  setNewAppliance({ ...newAppliance, name: e.target.value })
              }
          />
          <input
              type="number"
              placeholder="Quantity"
              min="1"
              value={newAppliance.quantity}
              onChange={(e) =>
                  setNewAppliance({ ...newAppliance, quantity: parseInt(e.target.value) })
              }
          />
          <input
              type="number"
              placeholder="Power Consumption (kW)"
              step="0.01"
              min="0.01"
              value={newAppliance.power}
              onChange={(e) =>
                  setNewAppliance({ ...newAppliance, power: parseFloat(e.target.value) })
              }
          />
          <input
              type="number"
              placeholder="Hours of Use Per Day"
              step="0.01"
              min="0.01"
              value={newAppliance.hours}
              onChange={(e) =>
                  setNewAppliance({ ...newAppliance, hours: parseFloat(e.target.value) })
              }
          />
          <button onClick={addAppliance}>Add Appliance</button>
        </div>

        {/* Appliance List Table */}
        <div className="table-section">
          <h3>Appliance List</h3>
          <table>
            <thead>
            <tr>
              <th>Appliance</th>
              <th>Quantity</th>
              <th>Power (kW)</th>
              <th>Hours/Day</th>
              <th>Monthly Consumption (kWh)</th>
            </tr>
            </thead>
            <tbody>
            {appliances.map((appliance, index) => (
                <tr key={index}>
                  <td>{appliance.name}</td>
                  <td>{appliance.quantity}</td>
                  <td>{appliance.power}</td>
                  <td>{appliance.hours}</td>
                  <td>
                    {(
                        appliance.quantity * appliance.power * appliance.hours * 30
                    ).toFixed(2)}
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* Calculate Button */}
        <button onClick={calculateTotals}>Calculate Total</button>

        {/* Results */}
        <div className="summary-section">
          <p>Total Units Consumed: <strong>{totalUnits} kWh</strong></p>
          <p>Total Cost: <strong>LKR {totalCost}</strong></p>
          <p>
            Recommended Inverter:{" "}
            <strong>
              {recommendedInverter
                  ? recommendedInverter
                  : "Not Calculated"}
            </strong>
          </p>
          <p>House Load: {houseLoad} kW</p>
        </div>
      </div>
  );
}

export default App;
