import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js'

dotenv.config();

const app = express();
const port = 7890;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static("public")); 

const supabaseUrl = process.env.SUPABASE_URL; //supabase details
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

let items = [];

app.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('run')
            .select('*');
        res.render("index.ejs", {
            projectTitle: "Run Log",
            runList: data,
        });
    } catch(err) {
        console.error(err);
    }
});

app.post("/rest/hi", async (req, res) => {
    try {
        const { data, error } = await supabase.from('run').insert([
            {
                location: "CCSF Track",
                distance: "4",
                pace: "11:12",
                comments: "whoooosh",
            },
        ]);

        const newest_item = await supabase
            .from('run')
            .select("*") //columns to select from the database
            .order('id', { ascending: false })
            .limit(1);
        res.render("parts/run.ejs", {
            item: newest_item.data[0]
        });    
    } catch(err) {
        console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
