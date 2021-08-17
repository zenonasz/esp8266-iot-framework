import React, { useEffect } from "react";
import PropTypes from "prop-types";

import Config from "../configuration.json";
import { obj2bin } from "../functions/configHelpers";

import { Form, Button } from "./UiComponents";
import { DashboardItems } from "./DashboardItems";
// const [state, setState] = useState([]);
let loc;
if (Config.find(entry => entry.name === "language")) {
    loc = require("./../lang/" + Config.find(entry => entry.name === "language").value + ".json");
} else {
    loc = require("./../lang/en.json");
}

export function ConfigPage(props) {
    
    useEffect(() => {
        document.title = loc.titleConf;
    }, []);
   
    const confItems = <DashboardItems items={Config} data={props.configData} />;    

    let button;
    if (Object.keys(props.configData).length > 0) {
        button = <Button onClick={() =>
            fetch(`${props.API}/api/config/set`, {
                method: "post",
                body: form2bin(),                
            }).then((response) => { return response.status; })
                .then((status) => {
                    if (status == 200) {props.requestUpdate();}
                })         
        }>{loc.globalSave}</Button>;
    }

    const form = <><Form>
        {confItems}
    </Form>
    {button}        
    </>;

    return <><h2>{loc.titleConf}</h2><p>{form}</p></>;

    function form2bin() {
        const newData = {};

        for (let i = 0; i < Config.length; i++) {
            if (Config[i].hidden) {
                newData[Config[i].name] = props.configData[Config[i].name];
                continue;
            }

            switch (Config[i].type) {
                case "bool":
                    newData[Config[i].name] = document.getElementById(Config[i].name).checked;
                    break;

                default:
                    if (Config[i].inputControl == "slider") {
                        // Use state property that was modified when slider after change event fired
                        // newData[Config[i].name] = document.getElementById[Config[i].name].value;
                        // newData[Config[i].name] = parseInt(Config[i].value, 10);
                        newData[Config[i].name] = parseInt(props.configData[Config[i].name], 10);
                    } else {
                        newData[Config[i].name] = document.getElementById(Config[i].name).value;
                    }
            }
        }
        
        return obj2bin(newData, props.binSize, Config);
        
    }
    
}

ConfigPage.propTypes = {
    API: PropTypes.string,
    binSize: PropTypes.number,
    configData: PropTypes.object,
    requestUpdate: PropTypes.func,
};
