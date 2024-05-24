import {useState, useEffect} from 'react';
import config from '../../params/config.js';
import InputMask from 'react-input-mask';
import DatePicker from "react-datepicker";
import Video from '../video/Video.jsx';

import './style.css';
import "react-datepicker/dist/react-datepicker.css";

import { Rating, RoundedStar } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

import { registerLocale, setDefaultLocale } from 'react-datepicker';
import { ru } from 'date-fns/locale/ru';
registerLocale('ru-RU', ru);



export default function Form({nameForm, arValue}) {
    const [schema, setSchema] = useState(null);
    const [formValue, setFormValue] = useState({});
    const [url, setUrl] = useState(config.fullApi + nameForm + '/');
    const [edit, setEdit] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [startDate, setStartDate] = useState(new Date());
    const [rating, setRating] = useState({});

    const myStyles = {
        itemShapes: RoundedStar,
        activeFillColor: '#ffb700',
        inactiveFillColor: '#fbf1a9'
    };

    useEffect(
        () => {
            async function fetchData() {
                const response = await fetch(config.fullApi + 'schema/get/' + nameForm + '/');
                const answer = await response.json();
                
                for(let key in answer) {
                    let element = answer[key];
            
                    if(element.type === 'DBRef') {
                        let mdb =  await fetch(config.fullApi + element.collection + '/');
                        let ar  = await mdb.json();  
                        answer[key].arList = ar.data;
                    }
                }
                setSchema(answer);
              }
              setUrl(config.fullApi + nameForm + '/');
              fetchData();
              
              if(Object.keys(arValue).length > 0) {
                setFormValue(arValue);
                setEdit(true);
                setDisabled(false);
              }
              
        }, [nameForm, arValue, rating]
    );

    function renderSelect(ar) {
        let list = ar.arList;
        let value = Object.keys(ar.value).length > 0 ? ar.value._id : ar.value;

        if(ar.code === 'GAME') {
            value = new URLSearchParams(window.location.search).get("id") || 0;
        }

        return (
            <>
                <option key={0} value={0}>Выбери...</option>
                {
                list.map(item => (
                    <option selected={value === item._id} key={item._id} value={item._id}>{item.TITLE}</option>
                ))
                }
            </>
        )
    }

    function renderForm(data = {}, ar = {}) {
        let formElements = [];

        for(let i in data) {
            let newRow = data[i];

            newRow.code = i;
            newRow.value = (ar[i]) ? ar[i] : '';

            switch(newRow.type) {
                case 'String':
                    newRow.fieldType = 'text';
                    newRow.field = 'field';
                break;

                case 'Number':
                    newRow.fieldType = 'number';
                    newRow.field = 'field';
                break;

                case 'Phone':
                    newRow.fieldType = 'tel';
                    newRow.field = 'tel';
                break;

                case 'Email':
                    newRow.fieldType = 'email';
                    newRow.field = 'field';
                break;

                case 'Password':
                    newRow.fieldType = 'password';
                    newRow.field = 'field';
                break;

                case 'DBRef':
                    newRow.fieldType = 'select';
                    newRow.field = 'select';                        
                    newRow.list = renderSelect(newRow);
                break;

                case 'Date':
                    newRow.fieldType = 'date';
                    newRow.field = 'date';
                break;

                case "File":
                    newRow.fieldType = "file";
                    newRow.field = "file";
                break;

                case "Rating":
                    newRow.fieldType = 'rating';
                    newRow.field = "rating";
                break;

                case 'Hidden':
                default:
                    newRow.fieldType = 'hidden';
                    newRow.field = 'field';
                break;
            }

            formElements.push(newRow);
        }

        return (
            <>
                {
                    formElements.map((item, index) => (
                        <label key={index} htmlFor={item.code}>
                            <span>{item.loc} {item.require && '*'}</span>
                            { 
                                item.field === 'field' &&  <input name={item.code} 
                                    required={item.require && true}
                                    defaultValue={item.value && item.value }
                                    onChange={item.sim && callMethod}
                                    readOnly={item.readOnly}
                                    step={(item.fieldType === 'number') ? item.step : null}
                                    type={item.fieldType} /> 
                            }

                            {item.field === 'rating' && 
                                <>
                                    <Rating style={{ maxWidth: 150 }} value={rating[item.code]} 
                                    onChange={(selectedValue) => {
                                        let ob = {};
                                        ob[item.code] = selectedValue;
                                        setRating((prevData) => ({ ...prevData, ...ob }))
                                        }
                                    }
                                    itemStyles={myStyles} />
                                    <input type='hidden' name={item.code} defaultValue={rating[item.code]} />
                                </>
                            }

                            {item.field === "file" && (
                                <input type="file" name={item.code} />
                            )}

                            { 
                                item.field === 'select' && <select name={item.code}>{item.list}</select>
                            }

                            { 
                                item.field === 'tel' && <InputMask 
                                    name={item.code}
                                    required={item.require && true} 
                                    defaultValue={item.value && item.value }
                                    mask="+7(999)-999-99-99" 
                                    maskChar="_" />
                            }

                            {
                                item.field === 'date' && <DatePicker 
                                    selected={startDate} 
                                    dateFormat="dd.MM.yyyy"
                                    name={item.code}
                                    defaultValue={item.value && item.value }
                                    required={item.require && true} 
                                    locale='ru-RU'
                                    onChange={(date) => setStartDate(date)} />
                            }

                        </label>
                    ))
                }
            </>
        );
    }

    function clearForm(e) {
        e.preventDefault();
        setFormValue({});
        renderForm(schema, {});
        setEdit(false);
        setDisabled(true);
    }

    function checkRequired(e) {
        let formElements = e.target.closest('form').querySelectorAll('input, select, textarea'); //querySelector
        let error = 0;
        formElements.forEach(item => {
            if(item.required === true && (item.value == "0" || item.value === '')) {
                setDisabled(true);
                error++;
            }
        });

        if(error === 0)
            setDisabled(false);
    }

    function callMethod(event) {
        console.log(event);
        let form = event.target.closest('form');
        let name = event.target.name;
        let obSchema = schema;
        let curSchemaSim = obSchema[name].sim;

        if(curSchemaSim) {
            let total = form.querySelector('input[name='+curSchemaSim+']');
            let value = 0;
            let method = obSchema[curSchemaSim].method;
            let arSimFields = obSchema[curSchemaSim].fields;
            let arFields = [];

            arSimFields.forEach((item) => {
                arFields.push(form.querySelector('input[name='+item+']'));
            });

            switch (method) {
                case 'MULTIPLY':
                    value = arFields[0].value * arFields[1].value;
                break;
            }

            total.value = value;
        }
    }
    
    return (
        <form className='editForm' method='POST' action={url} onChange={checkRequired}>
            { renderForm(schema, formValue) }
            <button disabled={disabled && disabled}>
                {edit && 'Изменить'}
                {!edit && 'Сохранить'}
            </button>
            <button onClick={clearForm}>Сбросить</button>
        </form>
    )
}
