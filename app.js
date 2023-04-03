// create the constants of the packages that we're gonna use
const express = require("express");
const app = express();
const https = require("node:https");
const mailChimp = require("@mailchimp/mailchimp_marketing");
const md5 = require("md5");
const port = 3000;
// const apiKey= "d78a6b095d540fc1cf42b2cece76c242-us11";
// const listId = "00e0610082";


// intead of body-parser we use the native module inside express
app.use(express.urlencoded({
    extended: true
}));
// create a Public folder that contains de css and html and use the static method 
app.use(express.static("public"));
// we send the html file when the user is in the home page "/"
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

// config the mailchimp obj
mailChimp.setConfig({
    apiKey: "d78a6b095d540fc1cf42b2cece76c242-us11",
    server: "us11",
});

//  create a post into the main page with all the information obtained from the input box using the express parser
app.post("/", (req, res) => {
    const name = req.body.name;
    const lastName = req.body.lastName;
    const mail = req.body.email;
    const listId = "00e0610082";
    const subscribeUser = {
        firstName: name,
        lastName: lastName,
        email: mail,
    }
    // create a function that add a n ew momber to the mailchimp list
    async function run() {
        const response = await mailChimp.lists.addListMember(listId, {
            email_address: subscribeUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribeUser.firstName,
                LNAME: subscribeUser.lastName,
            }
        });
        // if the addign is succsesfull we make a send to the succes html that indicates that everything went as espected 
            res.sendFile(__dirname + "/success.html");
            console.log(`Contact successfully added with id ${response.id}`);
        }
        // if not we catch the error and send the fail.html
    run().catch(e => res.sendFile(__dirname + "/fail.html"));
});

// if the post fails or succeeds we use the button for redirect to the main page
app.post("/fail", (req, res)=> {
    res.redirect("/");
});

app.post("/success", (req, res) =>{
    res.redirect("/");
});

app.post("/terms", (req, res)=> {
    res.redirect("/terms");
});



// check if the por 3000 is working propperly
app.listen(port, () => {
    console.log(`server online in port ${port}`);
})