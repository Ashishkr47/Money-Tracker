import { useState, useEffect } from "react";
import './App.css';

function App() {
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState("");

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = (process.env.REACT_APP_API_URL + "/transaction");
    const response = await fetch(url);
    return await response.json();
  }

  async function addNewTransaction(e) {
    e.preventDefault();
    const url = (process.env.REACT_APP_API_URL + "/transaction");
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price,
          name,
          description,
          datetime,
        }),
      });
  
      if (response.ok) {
        // Transaction was added successfully, now update the transactions state
        const updatedTransactions = await getTransactions();
        setTransactions(updatedTransactions);
        setPrice("");
        setName("");
        setDatetime("");
        setDescription("");
      } else {
        console.error("Failed to add transaction.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  

  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }
  balance = balance.toFixed(2);

  return (
    <main>
      <div>
      <img src="/image.png" alt="Logo" />
      </div>
      
      <h1>
        <span>₹</span>
        {balance}
        <span>.00</span>
      </h1>
      <form action="" onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={"price with +/-"}
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={"name"}
          />
          <input
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            type="datetime-local"
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={"description"}
          />
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction, index) => (
            <div key={index} className="transaction">
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div
                  className={
                    "price " + (transaction.price < 0 ? "red" : "green")
                  }
                >
                  {transaction.price}
                </div>
                <div className="datetime">{transaction.datetime}</div>
              </div>
            </div>

          ))}
       
      </div>
    </main>
  );
}

export default App;
