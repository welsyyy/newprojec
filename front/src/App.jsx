import Header from "./components/header/Header.jsx";
import "./App.css";
import Container from "./components/container/Container.jsx";
import Route from "./modules/Route.js";
import { useState, useEffect, useCallback } from "react";
import RatingList from "./components/ratingList/RatingList.jsx";

function App() {
    const [currentPath, setCurrentPath] = useState("index");
    const [dark, setDark] = useState(false);
    const [edit, setEdit] = useState(false);
    let curDarkStorage = localStorage.getItem("dark") === "true";
    let curEditStorage = localStorage.getItem("edit") === "true";

    const setPath = useCallback(async () => {
        let r = new Route();
        setCurrentPath(r.getUrl());
    }, []);

    useEffect(() => {
        setPath();
    }, [setPath, dark, edit]);

    if (curDarkStorage != dark) {
        toggleDark();
    }

    function toggleDark() {
        let value = dark === true ? false : true;
        localStorage.setItem("dark", value);
        setDark(value);
    }

    function toggleEdit() {
        let value = edit === true ? false : true;
        localStorage.setItem("edit", value);
        setEdit(value);
    }

    return (
        <>
            <div className={dark === true ? "App dark" : "App"}>
                <Header
                    curPath={currentPath}
                    changeDark={toggleDark}
                    editMode={toggleEdit}
                />

                <Container curPath={currentPath} edit={edit}></Container>
            </div>
        </>
    );
}

export default App;
