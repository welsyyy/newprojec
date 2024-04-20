import { useEffect, useState } from 'react';
import lang from './lang.js';
import Logo from '../../images/logo.png';
import './style.css';
import Menu from '../menu/Menu.jsx';

export default function Header({ curPath }) {
    /**
     * Правила работы с хуками
     * 1. Нельзя писать вне компонента
     * 2. useState и useEffect всегда должны быть на самом верхнем уровне 
     * (нельзя вкладывать в условия)
     * и в самом начале компонента
     */
    const [now, setNow] = useState(new Date());

    useEffect(
        () => {
            const interval = setInterval(() => setNow(new Date()), 1000);

            return () => {
                clearInterval(interval);
            }
        }, []
    )

    return (
        <>
        <header>
            <div className='LogoGroup'>
            <img src={Logo} width="30px" alt='' />
            <h1>SPA</h1>
            </div>
            
            <Menu curPath={curPath} />

            <div className='timer'>
                Время: { now.toLocaleTimeString() }
                </div> 
                
        </header>

        <h1>
            {curPath != "" && lang[curPath]}
            {curPath === "" && lang.index}
        </h1>
        </>
        
    )
}