import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { Box, TextField } from '@mui/material'
import { useState } from 'react'


// Function to handle registration
const fetchData = async (username: string, password: string, email: string) => {
    try {
        const response = await fetch("http://localhost:8000/user/register",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email
            })
        })

        if (!response.ok) {
            throw new Error("Error fecthing data")
        }
        const data = await response.json()
        console.log(data)

        if(response.status === 200) {
            window.location.href = "/login"
        }


    } catch (error) {
        if (error instanceof Error) {
            console.log(`Error when trying to register: ${error.message}`)
        }
    }


}



const Register = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [email, setEmail] = useState<string>('')
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
            {/* Registration form card */}
            <Card variant="outlined" sx={{ padding: 3, minWidth: 300 }}>
                <CardContent>
                <Typography variant="h4">Register</Typography>
                <Box
                        component="form"
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                        '& .MuiTextField-root': { m: 1, width: '100%' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            required
                            id="outlined-email-input"
                            label="Email"
                            defaultValue=""
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Username"
                            defaultValue=""
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            required
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button variant="contained" sx={{ width: '100%', m: 1 }} color="primary" onClick={() => fetchData(username, password, email)}>Register</Button>
                    </Box>
                
                </CardContent>
            </Card>
        </Box>
    )
  }

export default Register  