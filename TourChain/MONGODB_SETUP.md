# How to Create a Free MongoDB Atlas Cluster

Follow these steps to set up your free MongoDB database and get the connection string for the project.

## 1. Sign Up & Create Cluster
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2.  Sign up or log in with Google/GitHub.
3.  Click **+ Create** or **Build a Database**.
4.  Select **M0 Sandbox (Free)** tier.
5.  Choose a provider (AWS is fine) and a region close to you.
6.  Click **Create**.

## 2. Set Up Security (Crucial!)
1.  **Database User**:
    *   Go to **Database Access** (side menu).
    *   Click **Add New Database User**.
    *   Enter a **Username** (e.g., `tourchain_user`) and a **Password**.
    *   **IMPORTANT**: Copy the password somewhere safe. You will need it later.
    *   Click **Add User**.
2.  **Network Access**:
    *   Go to **Network Access** (side menu).
    *   Click **Add IP Address**.
    *   Select **Allow Access from Anywhere** (0.0.0.0/0). *This is easiest for development.*
    *   Click **Confirm**.

## 3. Get Connection String
1.  Go to **Database** (side menu) -> Click **Connect** on your cluster.
2.  Select **Drivers** (Node.js).
3.  Copy the **connection string**. It will look like this:
    ```text
    mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    ```

## 4. Configure Project
1.  Open the file `backend/.env` in the project.
2.  Find `MONGO_URI`.
3.  Paste your connection string.
4.  **Replace `<password>`** with the actual password you created in Step 2.
5.  **Repeat** this for `police_backend/.env`.
