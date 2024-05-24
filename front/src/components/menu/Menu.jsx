import { useCallback, useEffect, useState } from "react";
import config from "../../params/config.js";
import './style.css';

export default function Menu({ curPath }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMenu = useCallback(async () => {
        setLoading(true);
        const response = await fetch(config.fullApi + 'Menu/');
        const unPreparedData = await response.json();
        setData(unPreparedData.data);
        setLoading(false);
    }, [])

    useEffect(
        () => {
            fetchMenu();
        }, [fetchMenu]
    )

    return (
        <menu>
            {
                !loading && data.map((menuElement) => (
                    <li className={curPath === menuElement.LINK ? 'selected' : null} key={menuElement._id}><a href={menuElement.LINK}>{menuElement.NAME}</a></li>
                ))
            }
        </menu>
    )
}