import { useState, useCallback, useEffect } from "react";
import Form from "../form/Form.jsx";
import Table from "../table/Table.jsx";
import Index from "../index/Index.jsx";
import Search from "../search/Search.jsx";

export default function Container({ curPath }) 
{
    const [row, setRow] = useState({});
    const [query, setQuery] = useState('');
    const [collectName, setCollectionName] = useState(null);

    const handle = (value) => {
        if(value.data)
            setRow(value.data[0]);
    }

    const handleSearch = (value) => {
        if(value != '')
            setQuery(value);
    }

    const setCollection = useCallback(async () => {
        if(curPath !== 'index' && curPath !== '/')
            setCollectionName(curPath);
    });

    useEffect(
        () => {
            setCollection();
        }, [setCollection]
    );

    return (
        <div className="container">
            {collectName && <Search onChange={handleSearch} nameCollection={collectName}/> }
            {collectName && <Form arValue={row} nameForm={collectName}></Form> }
            {collectName && <Table onChange={handle} nameTable={collectName} query={query}></Table>}

            {!collectName && <Index/>}
        </div>
    )
}