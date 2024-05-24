import { useEffect, useState, useCallback } from 'react';
import './ratinglist.css';
import { Rating, RoundedStar } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import config from '../../params/config';
import Video from '../video/Video';

//https://doka.guide/css/grid-guide/ - гайд по гридам

export default function RatingList({
    collectionName = 'rating',
    limit,
    paginator = false
}) {
    
    const [ratingList, setRatingList] = useState({
        header: [],
        body: [],
        footer: [],
        sim: []
    });

    const fetchNews = useCallback(async () => {
        //let getReq = window.location.search;
        if(collectionName != '' && collectionName != null) {
            let urlRequest = config.fullApi + collectionName +'/';
            await getFetch(urlRequest);
        }
        
    }, [collectionName]);

    const myStyles = {
        itemShapes: RoundedStar,
        activeFillColor: '#ffb700',
        inactiveFillColor: '#fbf1a9'
    };

    useEffect(
        () => {
            fetchNews();
        }, [fetchNews]
    );

    async function getFetch(url) {
        const response = await fetch(url);
        const unPreparedData = await response.json();
        const data = {
            header: unPreparedData.head,
            body: unPreparedData.data,
            footer: [],
            sim: unPreparedData.sim
        };
        setRatingList(data);
    }

    function getContent(col, index, sim, schema) {
        let value = '';
        console.log(col)

        if(col.ref) {
            let val = sim[col.collectionName].filter(item => item._id === col._id)[0];
            value = <div className='game'>Игра: <a href={'/game/?id=' + String(val._id)}>{val.TITLE}</a></div>;
        }
        else {
            value = col;

            let getIndex = 0;
            let curSchema = 0;
            let code = 0;
            
            for(let i in schema) {
                if(getIndex === index) {
                    curSchema = schema[i]
                    code = i;
                }
                getIndex++;
            }

            if(code === '_id') {
                value = false;
            }

            if(code === 'TITLE') {
                value = <div className='title'>Название: <span>{value}</span></div>
            }

            if(code === 'LINK') {
                value = <div className='video'>
                    <Video width={'100%'} height={'200px'} url={value}></Video>
                </div>
            }

            if(curSchema.type === 'Rating') {
                value = <div className={'rating ' + code.toLowerCase() }>
                        {curSchema.loc}: 
                        <Rating style={{ maxWidth: 100 }} value={col} readOnly itemStyles={myStyles} />
                    </div>
            }
        }

        return (
            <>
                {value !== false && value}
            </>
        )
    }

    return (
        <>
            <div className='news-list'> 
                {ratingList &&
                    ratingList.body.map(row => (
                        <div className='news-card'>
                            {
                                Object.values(row).map((col, index) => (
                                    getContent(col, index, ratingList.sim, ratingList.header)
                                ))
                            }
                        </div>
                    ))}
            </div>
        </>
    )
}