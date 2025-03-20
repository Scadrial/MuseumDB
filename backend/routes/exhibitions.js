const url = require("url");
const db = require("../db"); // Import database connection
const authMiddleware = require("../middleware/authMiddleware"); // Import Authentication Middleware

module.exports = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (method === "OPTIONS") {
        res.writeHead(204);
        return res.end();
    }

    // Retreive all artwork records from the database
    if (parsedUrl.pathname === "/exhibitions" && method === "GET") {
        return authMiddleware(["staff", "admin"])(req, res, () => {
            db.query("SELECT * FROM artworks", (err, results) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ message: "Error retrieving artworks", error: err }));
                }
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(results));
            });

        });
    }

    // Retrieve all Exhibition artworks records from the database
    if(parsedUrl.pathname === "/exhibitions" && method === "GET"){
        return authMiddleware(["staff", "admin"])(req, res, () =>{
            db.query("SELECT * FROM exhibitions_artworks", (err, results) => {
                if(err){
                    res.writeHead(500, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify({ message: "Error retrieving exhibition artworks", error: err }));
                }
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(results));
            });
        });
    }


    // Retrieve all Exhibition records from the database
    if(parsedUrl.pathname === "/exhibitions" && method === "GET"){
        return authMiddleware(["staff", "admin"])(req, res, () =>{
            db.query("SELECT * FROM exhibitions", (err, results) => {
                if(err){
                    res.writeHead(500, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify({ message: "Error retrieving exhibitions", error: err }));
                }
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(results));
            });
        });
    }

    // Retrieve all Special Exhibtion records from the data
    if(parsedUrl.pathname === "/exhibitions" && method === "GET"){
        return authMiddleware(["staff", "admin"])(req, res, () =>{
            db.query("SELECT * FROM special_exhibitions", (err, results) => {
                if(err){
                    res.writeHead(500, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify({ message: "Error retrieving  special exhibitions", error: err }));
                }
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(results));
            });
        });
    }

    // Retrieve all records from exhibition staff
    if(parsedUrl.pathname === "/exhibitions" && method === "GET"){
        return authMiddleware(["staff", "admin"])(req, res, () =>{
            db.query("SELECT * FROM exhibition_staff", (err, results) => {
                if(err){
                    res.writeHead(500, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify({ message: "Error retrieving  special exhibitions", error: err }));
                }
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(results));
            });
        });
    }

    // Retrieve all records from special exhibitions staff
    if(parsedUrl.pathname === "/exhibitions" && method === "GET"){
        return authMiddleware(["staff", "admin"])(req, res, () =>{
            db.query("SELECT * FROM special_exhibition_staff", (err, results) => {
                if(err){
                    res.writeHead(500, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify({ message: "Error retrieving  special exhibitions staff", error: err }));
                }
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(results));
            });
        });
    }

    // POST /exhibitions - Add a new artwork to the database (PROTECTED)
    else if (parsedUrl.pathname === "/exhibitions" && method === "POST") {
        return authMiddleware("staff")(req, res, () => {
            let body = "";
            req.on("data", (chunk) => { body += chunk; });
            req.on("end", () => {
                try {
                    const newArtwork = JSON.parse(body);
                    console.log("Received New Artwork Data:", newArtwork); // Debugging log

                    // Validate required fields
                    if (!newArtwork.artworkID || !newArtwork.title || !newArtwork.artistName || !newArtwork.yearCreated || !newArtwork.medium || !newArtwork.yearAcquired || !newArtwork.location || !newArtwork.artCollectionType) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ message: "Missing required fields." }));
                    }

                    // Correct SQL query (Artwork_ID is auto-increment)
                    const query = `INSERT INTO artworks (Artwork_ID, Title, Artist_Name, Year_Created, Medium, Year_Acquired, Provenance, Location, ArtCollection_Type) 
                                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                    const values = [
                        parseFloat(newArtwork.artworkID), // I am going to write an SQL script to update the artworks table.
                                                          // You can get rid of the parseFloat() on this and the one below 
                                                          // just use integer values to test it
                        newArtwork.title,
                        newArtwork.artistName,
                        newArtwork.yearCreated,
                        newArtwork.medium,
                        newArtwork.yearAcquired,
                        newArtwork.location,
                        newArtwork.artCollectionType,
                    ];

                    db.query(query, values, (err, results) => {
                        if (err) {
                            console.error("Database Insert Error:", err);
                            res.writeHead(500, { "Content-Type": "application/json" });
                            return res.end(JSON.stringify({ message: "Error adding artwork", error: err }));
                        }

                        res.writeHead(201, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ message: "artwork added successfully!", insertedId: results.insertId }));
                    });
                } catch (error) {
                    console.error("Invalid JSON format:", error);
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Invalid JSON format" }));
                }
            });
        });
    }

    // POST /exhibitions - Add a new artwork to an exhibition the database (PROTECTED)
    else if (parsedUrl.pathname === "/exhibitions" && method === "POST") {
        return authMiddleware("staff")(req, res, () => {
            let body = "";
            req.on("data", (chunk) => { body += chunk; });
            req.on("end", () => {
                try {
                    const exhibitionArtworks= JSON.parse(body);
                    console.log("Received New Exhibition Data:", exhibitionArtworks); // Debugging log

                    // Validate required fields
                    if (!exhibitionArtworks.artworkID || !exhibitionArtworks.exhibitionID ) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ message: "Missing required fields." }));
                    }

                    // Correct SQL query (Exhibition_ID is auto-increment)
                    const query = `INSERT INTO artworks (Exhibition_ID, Artwork_ID,) 
                                   VALUES (?, ?)`;

                    const values = [
                        parseFloat(exhibitionArtworks.artworkID) ,
                        exhibitionArtworks.exhibitionID,
                    ];

                    db.query(query, values, (err, results) => {
                        if (err) {
                            console.error("Database Insert Error:", err);
                            res.writeHead(500, { "Content-Type": "application/json" });
                            return res.end(JSON.stringify({ message: "Error adding artwork to an exhibition", error: err }));
                        }

                        res.writeHead(201, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ message: "artwork added to an exhibition artworks successfully!", insertedId: results.insertId }));
                    });
                } catch (error) {
                    console.error("Invalid JSON format:", error);
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Invalid JSON format" }));
                }
            });
        });
    }

    // POST /exhibitions - Add a new staff member to an exhibition the database (PROTECTED)
    else if (parsedUrl.pathname === "/exhibitions" && method === "POST") {
        return authMiddleware("staff")(req, res, () => {
            let body = "";
            req.on("data", (chunk) => { body += chunk; });
            req.on("end", () => {
                try {
                    const exhibitionStaff= JSON.parse(body);
                    console.log("Received New exhibition staff Data:", exhibitionStaff); // Debugging log

                    // Validate required fields
                    if (!exhibitionStaff.exhibitionID || !exhibitionStaff.staffID ) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ message: "Missing required fields." }));
                    }

                    // Correct SQL query (Exhibition_ID is auto-increment)
                    const query = `INSERT INTO artworks (Exhibition_ID, Staff_ID) 
                                   VALUES (?, ?)`;

                    const values = [
                        exhibitionStaff.exhibitionID ,
                        exhibitionStaff.staffID,
                    ];

                    db.query(query, values, (err, results) => {
                        if (err) {
                            console.error("Database Insert Error:", err);
                            res.writeHead(500, { "Content-Type": "application/json" });
                            return res.end(JSON.stringify({ message: "Error adding artwork to an exhibition", error: err }));
                        }

                        res.writeHead(201, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ message: "exhibition staff successfully!", insertedId: results.insertId }));
                    });
                } catch (error) {
                    console.error("Invalid JSON format:", error);
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Invalid JSON format" }));
                }
            });
        });
    }

    // POST /exhibitions - Add a new exhibition the database (PROTECTED)
    else if (parsedUrl.pathname === "/exhibitions" && method === "POST") {
        return authMiddleware("staff")(req, res, () => {
            let body = "";
            req.on("data", (chunk) => { body += chunk; });
            req.on("end", () => {
                try {
                    const exhibitions= JSON.parse(body);
                    console.log("Received New exhibition Data:", exhibitions); // Debugging log

                    // Validate required fields
                    if (!exhibitions.exhibitionID ||  !exhibitions.name || !exhibitions.startDate || !exhibitions.endDate || !exhibitions.budget || !exhibitions.location || !exhibitions.numTicketsSold || !exhibitions.themes || !exhibitions.numArtworks) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ message: "Missing required fields." }));
                    }

                    // Correct SQL query (Exhibition_ID is auto-increment)
                    const query = `INSERT INTO artworks (Exhibition_ID, Name, Start_Date, End_Date, Budget, Location, Num_Tickets_Sold, Themes, Num_Of_Artworks) 
                                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                    const values = [
                        exhibitions.exhibitionID,
                        exhibitions.name,
                        exhibitions.startDate,
                        exhibitions.endDate,
                        exhibitions.budget,
                        exhibitions.location,
                        exhibitions.numTicketsSold,
                        exhibitions.themes,
                        exhibitions.numArtworks,
                    ];

                    db.query(query, values, (err, results) => {
                        if (err) {
                            console.error("Database Insert Error:", err);
                            res.writeHead(500, { "Content-Type": "application/json" });
                            return res.end(JSON.stringify({ message: "Error adding an staff member exhibition", error: err }));
                        }

                        res.writeHead(201, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ message: "exhibition staff added successfully!", insertedId: results.insertId }));
                    });
                } catch (error) {
                    console.error("Invalid JSON format:", error);
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Invalid JSON format" }));
                }
            });
        });
    }

    
    // POST /exhibitions - Add a new special exhibition staff to the database (PROTECTED)
    else if (parsedUrl.pathname === "/exhibitions" && method === "POST") {
        return authMiddleware("staff")(req, res, () => {
            let body = "";
            req.on("data", (chunk) => { body += chunk; });
            req.on("end", () => {
                try {
                    const specialExhibitionsStaff= JSON.parse(body);
                    console.log("Received New special exhibition Data:", specialExhibitionsStaff); // Debugging log

                    // Validate required fields
                    if (!specialExhibitionsStaff.specialExhibitionID || !specialExhibitionsStaff.staffID) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ message: "Missing required fields." }));
                    }

                    // Correct SQL query (Special_Exhibition_ID is auto-increment)
                    const query = `INSERT INTO artworks (Special_Exhibition_ID, Staff_ID) 
                                   VALUES (?, ?)`

                    const values = [
                        specialExhibitionsStaff.specialExhibitionID,
                        specialExhibitionsStaff.staffID,
                    ];

                    db.query(query, values, (err, results) => {
                        if (err) {
                            console.error("Database Insert Error:", err);
                            res.writeHead(500, { "Content-Type": "application/json" });
                            return res.end(JSON.stringify({ message: "Error adding a special exhibition staff member", error: err }));
                        }

                        res.writeHead(201, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ message: "special exhibition staff member added successfully!", insertedId: results.insertId }));
                    });
                } catch (error) {
                    console.error("Invalid JSON format:", error);
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Invalid JSON format" }));
                }
            });
        });
    }

    // POST /exhibitions - Add a new special exhibition to the database (PROTECTED)
    else if (parsedUrl.pathname === "/exhibitions" && method === "POST") {
        return authMiddleware("staff")(req, res, () => {
            let body = "";
            req.on("data", (chunk) => { body += chunk; });
            req.on("end", () => {
                try {
                    const specialExhibitions= JSON.parse(body);
                    console.log("Received New special exhibition Data:", specialExhibitions); // Debugging log

                    // Validate required fields
                    if (!specialExhibitions.specialExhibitionID ||  !specialExhibitions.Name || !specialExhibitions.startDate || !specialExhibitions.endDate || !specialExhibitions.budget || !specialExhibitions.location) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ message: "Missing required fields." }));
                    }

                    // Correct SQL query (Special_Exhibition_ID is auto-increment)
                    const query = `INSERT INTO artworks (Special_Exhibition_ID, Name, Start_Date, End_Date, Budget, Location) 
                                   VALUES (?, ?, ?, ?, ?, ?)`

                    const values = [
                        specialExhibitions.specialExhibitionID,
                        specialExhibitions.Name,
                        specialExhibitions.startDate,
                        specialExhibitions.endDate,
                        specialExhibitions.budget,
                        specialExhibitions.location,
                    ];

                    db.query(query, values, (err, results) => {
                        if (err) {
                            console.error("Database Insert Error:", err);
                            res.writeHead(500, { "Content-Type": "application/json" });
                            return res.end(JSON.stringify({ message: "Error adding a special exhibition", error: err }));
                        }

                        res.writeHead(201, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ message: "special exhibition added successfully!", insertedId: results.insertId }));
                    });
                } catch (error) {
                    console.error("Invalid JSON format:", error);
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Invalid JSON format" }));
                }
            });
        });
    }


    // Handle Unknown Routes
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));

};
