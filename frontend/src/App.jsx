import { useEffect, useState } from 'react'
import axios from 'axios'
import "./style.css"

const baseUrl = 'http://localhost:3001/api/list'

const App = () => {
  const [list, setList] = useState([])
  const [newItem, setNewItem] = useState('')
  const [newAmount, setNewAmount] = useState(0)
  const [newUnit, setNewUnit] = useState('kpl')

  const hook = () => {
    axios
      .get(baseUrl)
      .then((response) => {
        console.log('Data fetched successfully', response.data)
        setList(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }

  useEffect(hook, [])

  const handleItemChange = (event) => setNewItem(event.target.value)
  const handleAmountChange = (event) => setNewAmount(event.target.value)
  const handleUnitChange = (event) => setNewUnit(event.target.value)

  const addItem = (event) => {
    event.preventDefault()
    if (newItem === '') {
      alert('Syötä tuotteen nimi')
      return
    }
    if (isNaN(newAmount) || newAmount === 0) {
      alert('Syötä oikea määrä')
      return
    }
    const newItemObject = {
      item: newItem,
      amount: parseInt(newAmount),
      unit: newUnit,
    }
    axios
      .post(baseUrl, newItemObject)
      .then((response) => {
        setList(list.concat(response.data))
        setNewItem('')
        setNewAmount(0)
        setNewUnit('kpl')
        hook()
      })
      .catch((error) => {
        console.error('Virhe listaan lisäyksessä', error)
      })
  }

  const Poista = ({ id }) => (
    <div className="poista">
      <button
        onClick={() =>
          axios.delete(`${baseUrl}/${id}`).then((response) => {
            hook()
          })
        }
      >
        Poista
      </button>
    </div>
  )

  const Dropdown = () => (
    <div className="dropdown">
      <select id="unit" value={newUnit} onChange={handleUnitChange}>
        <option value="kpl">kpl</option>
        <option value="ps">ps</option>
        <option value="kg">kg</option>
        <option value="l">l</option>
        <option value="tlk">tlk</option>
        <option value="pl">pl</option>
      </select>
    </div>
  )

  const Muokkaa = ({ item, amount, unit }) => (
    <div className="muokkaa">
      <button
        onClick={() => {
          document.getElementById('item').value = item
          setNewItem(item)
          document.getElementById('amount').value = amount
          setNewAmount(amount)
          document.getElementById('unit').value = unit
          setNewUnit(unit)
        }}
      >
        Muokkaa
      </button>
    </div>
  )

  const NäytäKauppalista = ({ list }) => (
    <div>
      <h2>Nykyinen Kauppalista</h2>
      <ul>
        {list.map((item, index) => (
          <div key={index} className="list-item">
            <div id="item">
              {index + 1}: {item.item} - {item.amount} {item.unit}
            </div>
            <Muokkaa item={item.item} amount={item.amount} unit={item.unit} />
            <Poista id={item.id} />
          </div>
        ))}
      </ul>
    </div>
  )

  return (

    document.title = "Kauppalista",

    <div id="root">

      <h1>Kauppalista</h1>
      <p>Selainohjelmoinnin Harjoitustyö</p>

      <form onSubmit={addItem}>

        <div id="tuote">
          Ostettava: <input id="tuote" value={newItem} onChange={handleItemChange} />
        </div>

        <div id="määrä">
          Määrä: <input id="amount" value={newAmount} onChange={handleAmountChange} />
          <Dropdown />
          <button className="lisää" id="submit" type="submit">Lisää</button>
        </div>
        
      </form>

      <NäytäKauppalista list={list} />

    </div>
  )
}

export default App
