import { useId, useState, useEffect } from "react";

const data = [
    {
        id: 0,
        name: 'Ankit Kumar'
    },
    {
        id: 1,
        name: 'Nitin Kumar'
    },
    {
        id: 2,
        name: 'Ankit Sharma'
    },
    {
        id: 3,
        name: 'Ankit Sharma'
    },
    {
        id: 4,
        name: 'Sachin Kumar'
    }

]


function App() {

    const [inputVal, setInputVal] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');

    const [urlData, setUrlData] = useState(null);
    const url = 'http://52.195.171.228:8080';
    useEffect(() => {
        const fetchData = async () => {
            try {
                const listBookUrl = url + '/books';
                console.log(listBookUrl);
                const response = await fetch(listBookUrl);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log('Response status:');
                const data = await response.json();
                setUrlData(data);
                console.log('Fetched data:', data);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }
        fetchData();
    }, []);

    const handleSubmit =(e) => {
        e.preventDefault();
        filterData(inputVal);
    }

    const filterData = (inputData) => {
        const inputFilter = data.filter((d) => d.name.includes(inputData));
        console.log(inputFilter);
    }

    return (
        <>
            <p>{urlData}</p>
            <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
            <button onClick={handleSubmit}>Search</button>
            <div>
                <select value={selectedValue} onChange={(e) => {setSelectedValue(e.target.value)}}>
                    <option value={''} >Select Value</option>
                    <option value={'all'}>All</option>  
                    <option value={'even'}>Even</option>
                    <option value={'odd'}>Odd</option>
                </select>
            </div>
            <div>
                {data.map((d) => (
                    <div>
                        <span>
                            <span>{d.id} : {d.name}</span>
                        </span>
                    </div>
                ))}
            </div>
        </>
    )
}

export default App;