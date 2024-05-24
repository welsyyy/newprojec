import {useState, useCallback, useEffect} from 'react';
import config from '../../params/config.js';    

import { Rating, RoundedStar } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import './style.css';
import './images/delete.png';
import './images/pencil.png';
import './images/star.png';

export default function Table({nameTable, onChange, query = ''}) {
    const [table, setTable] = useState({
        header: [],
        body: [],
        footer: [],
        sim: []
    });
    const [loading, setLoading] = useState(false);

    const myStyles = {
        itemShapes: RoundedStar,
        activeFillColor: '#ffb700',
        inactiveFillColor: '#fbf1a9'
    };

    const fetchTable = useCallback(async () => {
        setLoading(true);
        let getReq = window.location.search;
        let urlRequest = config.fullApi + nameTable +'/';

        if(query != '') {
            urlRequest += '?q=' + query;
        }

        if(query == '' && getReq != '') {
            urlRequest += getReq;
        }

        await getFetch(urlRequest);
        setLoading(false);
    }, [nameTable, onChange]);

    useEffect(
        () => {fetchTable()}, [fetchTable]
    )

    async function getFetch(url) {
        const response = await fetch(url);
        const unPreparedData = await response.json();
        const data = {
            header: unPreparedData.head,
            body: unPreparedData.data,
            footer: [],
            sim: unPreparedData.sim
        };

        setTable(data);
    }

    function getHeader(schema) {
        let header = [];
        for(let i in schema) {
            let obHeader = schema[i];

            obHeader.code = i;
            if(i === '_id')
                header.push({loc: 'ID'});
            else
                header.push(obHeader);
        } 

        header.push('');

        return (
            <tr>
                {
                    header.map((item, index) => (
                        <th key={index} 
                            data-code={item.code}
                            onClick={setSort}
                            className={item.sort ? 'sortable' : null}>
                                {item.loc}
                                <span></span>
                        </th>
                    ))
                }
            </tr>
        )
    }

    async function setSort(event) {
        let th = event.target;
        let parentRow = th.closest('tr');
        let allTh = parentRow.querySelectorAll('th');
        let order = th.classList.contains('DESC') ? 'DESC' : 'ASC';
        let code = event.target.dataset.code;
        let url = config.fullApi + nameTable + '/?sort=' + code + '&order=' + order;

        th.classList.add(order);

        await getFetch(url);

        if(order === 'ASC') {
            th.classList.add('DESC');
            th.classList.remove('ASC');
        }
        else {
            th.classList.remove('DESC');
            th.classList.add('ASC');
        }
    }
    
    function getContent(col, index, sim, schema) {
        let value = '';

        if(col.ref) {
            let val = sim[col.collectionName].filter(item => item._id === col._id)[0];
            value = val.TITLE;
        }
        else {
            value = col;

            let getIndex = 0;
            let curSchema = 0;

            for(let i in schema) {
                if(getIndex === index) {
                    curSchema = schema[i]
                }
                getIndex++;
            }

            if(curSchema.code === '_id') {
                value = '...' + col.slice(18,25);
            }

            if(curSchema.type === 'Phone') {
                let callTo = 'tel:' + col;
                value = <a href={callTo}>{col}</a>
            }

            if(curSchema.type === 'Email') {
                let mailTo = 'mailto:' + col;
                value = <a href={mailTo}>{col}</a>
            }

            if(curSchema.type === 'Date') {
                let date = new Date(col);
                value = Intl.DateTimeFormat('ru').format(date);
            }

            if(curSchema.type === 'Rating') {
                value = <Rating style={{ maxWidth: 100 }} value={col} readOnly itemStyles={myStyles} />
            }
        }

        return (
            <td key={index}>
                {value && value}
            </td>
        )
    }

    async function edit(event) {
        const url = config.fullApi + nameTable + '/?id=' + event.target.value;
        const response = await fetch(url);
        const answer = await response.json();
        onChange(answer);
    }

    async function drop(event) {
        const url= config.fullApi + nameTable + '/' + event.target.value + '/';
        const confirmWindow = window.confirm('Уверены?');
        if(confirmWindow) {
            const response = await fetch(url);
            const answer = response.status;

            if(answer === 200) {
                fetchTable();
            }
        }
    }

    function star(event) {
        let val = event.target.value;
        window.location = '/rating?id=' + val;
    }
    
    return (
        <>
            <table cellPadding={0} cellSpacing={0} className="simple-table">
                <thead>
                    {loading &&  <tr><td>Loading...</td></tr>}
                    {!loading && getHeader(table.header)}
                </thead>
                <tbody>
                    {loading && <tr><td>Loading...</td></tr>}

                    {
                        (!loading & table.body.length>0) && table.body.map(row => (
                            <tr key={row._id} id={row._id} tabindex="0">
                                { 
                                    Object.values(row).map((col, index) => (
                                        getContent(col, index, table.sim, table.header)
                                    ))
                                }
                                <td>
                                    <button value={row._id} onClick={edit} className='edit'></button>
                                    <button value={row._id} onClick={drop} className='drop'></button>
                                    {nameTable === 'game' && <button value={row._id} onClick={star} className='star'></button>}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </>
    )
}