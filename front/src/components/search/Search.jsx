
import { useCallback, useEffect, useState } from "react";
import config from "../../params/config.js";
import './style.css';
import DatePicker from "react-datepicker";

export default function Search({ onChange, nameCollection }) {
    const [schema, setSchema] = useState({});
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const [step, setStep] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);

    useEffect(
        () => {
            async function fetchData() {
                const response = await fetch(config.fullApi + 'schema/get/' + nameCollection + '/');
                const answer = await response.json();
                
                for(let key in answer) {
                    let element = answer[key];
            
                    if(element.type === 'DBRef') {
                        let mdb =  await fetch(config.fullApi + element.collection + '/');
                        let ar  = await mdb.json();  
                        answer[key].arList = ar.data;
                    }

                    if(element.filter && element.type === 'Number') {
                        let minRequest = await fetch(config.fullApi + nameCollection + '/?min=' + key);
                        let minValue = await minRequest.json();

                        let maxRequest = await fetch(config.fullApi + nameCollection + '/?max=' + key);
                        let maxValue = await maxRequest.json();

                        answer[key].limits = {
                            min : minValue.data[0][key],
                            max : maxValue.data[0][key],
                        };
                        
                        setStep(parseInt(element.step));
                        setMin(minValue.data[0][key]);
                        setMax(minValue.data[0][key] + step);
                    }   
                }

                setSchema(answer);
              }

              fetchData();
        }, [nameCollection]
    );

    function inputEvent(event) {
        onChange(event.target.value);
    }

    function toggleModal() {
        let modal = document.querySelector('.modal');
        let overlay = document.querySelector('.overlay');
        modal.classList.toggle('show');
        overlay.classList.toggle('show');
    }

    function changeValue(event) {
        let field = event.target;
        let parent = field.closest('.label');
        let key = field.list.id.split('_'); // [BUDGET, MIN/MAX]

        if(key[1] === 'MIN') {
            let obMax = parent.querySelector('input[list='+key[0]+'_MAX]');

            if(obMax.value <= field.value) {
                let maxValue = parseInt(field.value) + parseInt(step);

                if(maxValue > parseInt(field.max)) {
                    maxValue = parseInt(field.max);
                }
                setMax(maxValue);
            }

            if(field.value >= field.max) {
                setMin(parseInt(field.value) - parseInt(step));
            }
            else {
                setMin(field.value);
            }
        }

        if(key[1] === 'MAX') {
            let obMin = parent.querySelector('input[list='+key[0]+'_MIN]');

            if(field.value <= obMin.value) {
                let minValue = parseInt(field.value) - parseInt(step);

                if(minValue < parseInt(obMin.min)) {
                    setMin(obMin.min);
                }

                setMin(minValue);
            }
            
            if(field.value > field.min) {
                setMax(field.value);
            }
            else {
                setMax(parseInt(field.value) + parseInt(step));
            }
            
        }
    }

    function onChangeDates(dates) {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    function clearFilter(event) {
        event.preventDefault();
        let curPage = window.location;

        document.location.href = curPage.origin + curPage.pathname;
    }

    function renderFilter(data = {}) {
        let formElements = [];
        for(let i in data) {
            let newRow = data[i];

            newRow.code = i;
            if(newRow.filter) {
                switch(newRow.type) {
                    case 'Number':
                        newRow.field = 'range';
                    break;

                    case 'Date':
                        newRow.field = 'daterange';
                    break;
                }

                formElements.push(newRow);
            }
        }

        return(
            <>
                {
                    formElements.map((item, index) => (
                        <>
                        {
                            item.field === 'range' && <div className='label' key={index}> 
                            <span>{item.loc}</span>
                            <div className="rangeGroup">
                                от: 
                                <input type={item.field} 
                                    max={item.limits.max}
                                    min={item.limits.min}
                                    defaultValue={min}
                                    value={min}
                                    step={item.type === 'Number' && item.step}
                                    list={item.code + '_MIN'}
                                    name={item.code + '[FROM]'}
                                    onChange={changeValue}/>

                                {
                                    item.field === 'range' && 
                                    <datalist id={item.code + '_MIN'}>
                                        <option key='1' value={item.limits.min} label={item.limits.min}></option>
                                        <option key='2' className='curValue' value={min} defaultValue={min} label={min}></option>
                                        <option key='3' value={item.limits.max} label={item.limits.max}></option>
                                    </datalist>
                                }
                            </div>

                            <div className="rangeGroup">
                                до: 
                                <input type={item.field} 
                                    max={item.limits.max}
                                    min={item.limits.min}
                                    defaultValue={max}
                                    value={max}
                                    step={item.type === 'Number' && item.step}
                                    list={item.code + '_MAX'}
                                    name={item.code + '[TO]'}
                                    onChange={changeValue}/>

                                {
                                    item.field === 'range' && 
                                    <datalist id={item.code + '_MAX'}>
                                        <option key='1' value={item.limits.min} label={item.limits.min}></option>
                                        <option key='2' className='curValue' value={max}  defaultValue={max} label={max}></option>
                                        <option key='3' value={item.limits.max} label={item.limits.max}></option>
                                    </datalist>
                                }
                            </div>
                        </div>
                        }

                        {
                            item.field === 'daterange' && 
                            <div className='label' key={index}>
                                <span>{item.loc}</span>
                                <DatePicker
                                    selected={startDate}
                                    onChange={onChangeDates}
                                    startDate={startDate}
                                    endDate={endDate}
                                    selectsRange
                                    inline
                                />
                                <input type='hidden' name={item.code + '[FROM]'} defaultValue={startDate}/>    
                                <input type='hidden' name={item.code + '[TO]'} defaultValue={endDate}/>                        
                                </div>
                            
                        }
                        </>
                    ))
                }
            </>
        )
    }

    return (
        <>
        <div className="searchPanel">
            <label>
                <input onChange={inputEvent} placeholder="Введите поисковый запрос" />
            </label>

            <button onClick={toggleModal}></button>
        </div>

        <div className="modal">
            <div className="modal-head">Фильтр <button onClick={toggleModal}></button></div>
            <form method='GET' action=''>
                {renderFilter(schema)}

                <input type="hidden" name='filter' value='Y' />
                <div className='buttons'>
                    <button>Фильтровать</button>
                    <button onClick={clearFilter}>Сбросить фильтр</button>
                </div>
            </form>
        </div>
        <div className="overlay" onClick={toggleModal}></div>
        </>
        
    )
}