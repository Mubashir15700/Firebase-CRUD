import express from "express";
import { db } from "./firebase.js";

const app = express();

app.use(express.json());

// retrieve the entire "users" collection
app.get("/users", async (req, res) => {
    try {
        const querySnapshot = await db.collection("users").get();

        const allUsersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        if (allUsersData.length === 0) {
            return res.sendStatus(404);
        }

        res.status(200).send(allUsersData);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users");
    }
});

// retrieve a single user
app.get("/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        // Retrieve the user document with the provided ID
        const userDoc = await db.collection("users").doc(userId).get();

        // Check if the user document exists
        if (!userDoc.exists) {
            return res.sendStatus(404); // Not Found
        }

        // Extract user data from the document and send it in the response
        const userData = { id: userDoc.id, ...userDoc.data() };
        res.status(200).send(userData);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Error fetching user");
    }
});

// Update a user document
app.put("/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = req.body; // Updated user data

        // Update the user document with the provided ID
        await db.collection("users").doc(userId).update(userData);

        res.sendStatus(204); // No Content
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Error updating user");
    }
});

// Delete a user document
app.delete("/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        // Delete the user document with the provided ID
        await db.collection("users").doc(userId).delete();

        res.sendStatus(204); // No Content
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Error deleting user");
    }
});

// add new document
app.post("/users", async (req, res) => {
    try {
        const userData = req.body;
        const newUserRef = await db.collection("users").add(userData);

        // Send the ID of the newly created user as a response
        res.status(201).send({ id: newUserRef.id });
    } catch (error) {
        console.error("Error creating new user:", error);
        res.status(500).send("Error creating new user");
    }
});

app.listen(3000, () => {
    console.log("Server up");
});
