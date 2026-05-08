import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 4000;


const API =`https://api.open-meteo.com/v1/forecast?`;
const config = "daily=sunrise,uv_index_max,sunset,temperature_2m_max,temperature_2m_min&current=temperature_2m,is_day,rain&timezone=auto"
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", async (req,res) => {
    try{
        const latitude = req.query.lat || 28.6;
        const longitude = req.query.lon || 77.1333;
        const result = await axios.get(`${API}latitude=${latitude}&longitude=${longitude}&${config}`);
        const data = result.data;
        console.log(data);
        const currentTemp = data.current.temperature_2m;    
        const rain =data.current.rain;
        const sunrise =data.daily.sunrise[0].slice(11);
        const sunset =data.daily.sunset[0].slice(11);
        const uvIndex =data.daily.uv_index_max[0];
        const isDay =data.current.is_day;
        const maxTemp =data.daily.temperature_2m_max[0];
        const minTemp =data.daily.temperature_2m_min[0];
         res.render("index.ejs", {
        temp:currentTemp,
        rain,
        sunrise,
        sunset,
        uvIndex,
        isDay,
        maxTemp,
        minTemp,
    });
    } catch (err) {
        console.log(err);     
    }
});

app.post("/search", async (req, res) => {
    try {
        const location = req.body.location;

        const response = await axios.get(
            "https://photon.komoot.io/api/",
            {
                params: { q: location }
            }
        );

        if (!response.data.features.length) {
            return res.send("Location not found");
        }

        const result = response.data.features[0].geometry.coordinates;

        const long = result[0];
        const lat = result[1];

        res.redirect(`/?lat=${lat}&lon=${long}`);

    } catch (err) {
        console.log(err);
        res.send("Something went wrong");
    }
});


app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});

