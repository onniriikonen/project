import { Button, Toolbar, Box, AppBar, Typography }  from '@mui/material'
import { Link } from 'react-router-dom'

// Function to handle logout
const logout = () => {
    localStorage.removeItem("token")
    window.dispatchEvent(new Event("storage"))
    window.location.href = "/login"
}

const Navbar = () => {
    const token = localStorage.getItem("token")

    return (
        <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed">
                    <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Board App
                    </Typography>
                        {/* Conditional rendering based on authentication status */}
                        {!token ? (
                            <>
                                {/* Show login and register buttons if user is not authenticated */}
                                <Button component={Link} to="/login" color="inherit">Login</Button>
                                <Button component={Link} to="/register" color="inherit">Register</Button>
                            </>
                        ) : (     

                            /* Show logout button if user is authenticated */
                            <Button onClick={logout} color="inherit">Logout</Button>
                        )}
                        
                    </Toolbar>
                </AppBar>
            </Box>
    )
}

export default Navbar