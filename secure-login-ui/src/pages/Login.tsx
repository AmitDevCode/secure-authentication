"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import type { AuthenticationRequest, AuthenticationResponse } from "../models/authentication"
import { login, verifyCode } from "../services/authenticationService"
import { Eye, EyeOff } from "lucide-react" // Importing eye icons
import "./styles/Login.css"

const LOCKOUT_DURATION = 60 * 3 // 1 hour in seconds

const Login: React.FC = () => {
    const [authRequest, setAuthRequest] = useState<AuthenticationRequest>({})
    const [authResponse, setAuthResponse] = useState<AuthenticationResponse>({})
    const [otpCode, setOtpCode] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    // Account lockout state
    const [loginAttempts, setLoginAttempts] = useState(0)
    const [isLocked, setIsLocked] = useState(false)
    const [lockoutTime, setLockoutTime] = useState(0)
    const [remainingTime, setRemainingTime] = useState(0)

    // Load lockout state from localStorage on component mount
    useEffect(() => {
        const storedAttempts = localStorage.getItem("loginAttempts")
        const storedLockoutTime = localStorage.getItem("lockoutTime")

        if (storedAttempts) {
            setLoginAttempts(Number.parseInt(storedAttempts))
        }

        if (storedLockoutTime) {
            const lockTime = Number.parseInt(storedLockoutTime)
            const currentTime = Math.floor(Date.now() / 1000)
            const timeRemaining = lockTime + LOCKOUT_DURATION - currentTime

            if (timeRemaining > 0) {
                setIsLocked(true)
                setLockoutTime(lockTime)
                setRemainingTime(timeRemaining)
            } else {
                // Reset if lockout period has expired
                localStorage.removeItem("loginAttempts")
                localStorage.removeItem("lockoutTime")
            }
        }
    }, [])

    // Countdown timer
    useEffect(() => {
        let timer: NodeJS.Timeout

        if (isLocked && remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime((prev) => {
                    const newTime = prev - 1
                    if (newTime <= 0) {
                        setIsLocked(false)
                        localStorage.removeItem("loginAttempts")
                        localStorage.removeItem("lockoutTime")
                        clearInterval(timer)
                        return 0
                    }
                    return newTime
                })
            }, 1000)
        }

        return () => {
            if (timer) clearInterval(timer)
        }
    }, [isLocked, remainingTime])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setAuthRequest((prev) => ({ ...prev, [name]: value }))
    }

    const authenticate = async (e: React.FormEvent) => {
        e.preventDefault()

        // Check if account is locked
        if (isLocked) {
            alert("Your account is temporarily locked. Please try again later.")
            return
        }

        try {
            const response = await login(authRequest)
            setAuthResponse(response)

            // Reset login attempts on successful login
            setLoginAttempts(0)
            localStorage.removeItem("loginAttempts")
            localStorage.removeItem("lockoutTime")

            if (!response.mfaEnabled) {
                localStorage.setItem("token", response.accessToken as string)
                navigate("/dashboard")
            }
        } catch (error) {
            // Increment failed login attempts
            const newAttempts = loginAttempts + 1
            setLoginAttempts(newAttempts)
            localStorage.setItem("loginAttempts", newAttempts.toString())

            // Lock account after 3 failed attempts
            if (newAttempts >= 3) {
                const currentTime = Math.floor(Date.now() / 1000)
                setIsLocked(true)
                setLockoutTime(currentTime)
                setRemainingTime(LOCKOUT_DURATION)
                localStorage.setItem("lockoutTime", currentTime.toString())
                alert("Your account has been locked for 1 hour due to multiple failed login attempts.")
            } else {
                alert(`Login failed. ${3 - newAttempts} attempts remaining before account lockout.`)
            }
        }
    }

    const verifyTfa = async () => {
        try {
            const response = await verifyCode({ email: authRequest.email, code: otpCode })
            localStorage.setItem("token", response.accessToken as string)
            navigate("/dashboard")
        } catch (error) {
            alert("Verification failed")
        }
    }

    // Format remaining time as hh:mm:ss
    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <div className="container">
            <div className="center-box">
                {authResponse.mfaEnabled ? (
                    <div className="two-fa-setup">
                        <h2>Two-Factor Authentication</h2>
                        <input
                            type="text"
                            placeholder="Validation Code"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            required
                        />
                        <button onClick={verifyTfa} disabled={otpCode.length < 6}>
                            Verify code
                        </button>
                    </div>
                ) : (
                    <form onSubmit={authenticate}>
                        <h2>Login</h2>

                        {isLocked && (
                            <div className="account-locked">
                                <h4>Your account is locked</h4>
                                <div className="lockout-timer">
                                    <p>Time remaining until unlock:</p>
                                    <div className="timer">{formatTime(remainingTime)}</div>
                                </div>
                            </div>
                        )}

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                        />

                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {loginAttempts > 0 && !isLocked && (
                            <div className="login-warning">
                                Warning: {3 - loginAttempts} attempts remaining before account lockout.
                            </div>
                        )}

                        <button type="submit" disabled={isLocked}>
                            {isLocked ? "Account Locked" : "Login"}
                        </button>

                        <a href="/register">Register</a>
                    </form>
                )}
            </div>
        </div>
    );

}

export default Login
