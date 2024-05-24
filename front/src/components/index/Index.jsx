import React, { useCallback, useEffect, useState } from "react";
import config from "../../params/config";
import { CChart } from '@coreui/react-chartjs';
import '../table/style.css';

export default function Index() {
    const [table, setTable] = useState({
        body: []
    });

    const [pie, setPie] = useState({
        labels: [],
        numbers: [],
        indexes: [],
        count: 1
    });

    const [loading, setLoading] = useState(false);

    const fetchTable = useCallback(async () => {
        setLoading(true);
        const response = await fetch(config.fullApi + 'collections/get/');
        const unPreparedData = await response.json();

        let labels = [];
        let numbers = [];
        let indexes = [];

        unPreparedData.forEach(item => {
            labels.push(item.TITLE.split('.')[1]);
            numbers.push(item.DOCUMENTS);
            indexes.push(item.INDEXES);
        })

        setPie({
            labels: labels,
            numbers: numbers,
            indexes: indexes,
            count: labels.length
        })

        setTable({
            body: unPreparedData
        });
        setLoading(false);
    }, []);

    useEffect(
        () => {fetchTable()}, [fetchTable]
    );

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    };

    function getColors(count) {
        if(count > 0) {
            let arColors = [];
            let arColorCode = ['A', 'B', 'C', 'D', 'E', 'F', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

            //rgb(255,255,255);
            //hex #00000000

            for(let j = 0; j < count; j++) {
                let color = "#";

                for(let i = 0; i < 6; i++) {
                    color += arColorCode[getRandomInt(arColorCode.length)];
                }

                arColors.push(color);
            }

            return arColors;
        }
    }

    return (
        <>
        <table cellPadding={0} cellSpacing={0} className="simple-table">
            <thead>
                <tr>
                    <th>Название коллекции</th>
                    <th>Индексы</th>
                    <th>Кол-во документов</th>
                </tr>
            </thead>
            <tbody>
                {loading && <tr><td>Loading...</td></tr>}

                {
                    !loading && table.body.map((row, index) => (
                        <tr key={index}>
                            { 
                                Object.values(row).map((col, key) => (
                                    <td key={key}>{col}</td>
                                ))
                            }
                        </tr>
                    ))
                }
            </tbody>
        </table>

        <div>
            <h3>Документы</h3>
        <CChart
            type="doughnut"
            data={{
                labels: pie.labels,
                datasets: [
                {
                    data: pie.numbers,
                    backgroundColor: getColors(pie.count),
                },
                ],
            }}
            options={{
                plugins: {
                legend: {
                    labels: {
                    //color: getStyle('--cui-body-color'),
                    }
                }
                },
            }}
            />
            </div>

            <div>
                <h3>Индексы</h3>
                <CChart
                    type="doughnut"
                    data={{
                        labels: pie.labels,
                        datasets: [
                        {
                            backgroundColor: getColors(pie.count),
                            data: pie.indexes,
                        },
                        ],
                    }}
                    options={{
                        plugins: {
                        legend: {
                            labels: {
                            //color: getStyle('--cui-body-color'),
                            }
                        }
                        },
                    }}
                    />
            </div>
        </>
    )
}