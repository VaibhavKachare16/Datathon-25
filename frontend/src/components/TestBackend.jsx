import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/api";

function TestBackend() {
    const [data, setData] = useState({ data: "No data received" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/hello`);
                console.log(response.data);
                
                if (response && response.data) {
                    setData(response.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setData({ data: "Error fetching data" });
            }
        };

        fetchData();
    }, []);

    return <>{data.data}</>;
}

export default TestBackend;
