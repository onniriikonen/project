import { Typography, Box, Button, TextField, Card, CardContent } from "@mui/material"
import { useState } from "react"

const fetchData = async (email: string, password: string) => {
    try {
        const response = await fetch("http://localhost:8000/user/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        if (!response.ok) {
            throw new Error("Error fecthing data")
        }
        const data = await response.json()
        console.log(data)

        if(data.token) {
            localStorage.setItem("token", data.token)
            window.location.href = "/"
        }

    } catch (error) {
        if (error instanceof Error) {
            console.log(`Error when trying to register: ${error.message}`)
        }
    }


}



const Login = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                height: "100vh",
                width: "100vw",
                paddingTop: "70px"
            }}
        >
            <Card variant="outlined"sx={{ padding: 3, minWidth: 300 }}>
                <CardContent>
                    <Typography variant="h4">Login</Typography>
                    <Box
                        component="form"
                        sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        "& .MuiTextField-root": { m: 1, width: "100%" },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                        required
                        id="outlined-required"
                        label="Username"
                        defaultValue=""
                        onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                        required
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                        onClick={() => fetchData(email, password)}
                        variant="contained"
                        sx={{ width: "100%", mt: 2 }}
                        color="primary"
                        >
                        Login
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
  }

export default Login