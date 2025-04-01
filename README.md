# Spring Security Google Authenticator

This project demonstrates the integration of **Google Authenticator** with **Spring Security** to enable **two-factor authentication (2FA)** in a Spring Boot application.

## Features
- User authentication using Spring Security
- Integration with Google Authenticator for 2FA
- Secure login with time-based one-time passwords (TOTP)
- Spring Boot-based implementation

## Prerequisites
Ensure you have the following installed before running the project:
- Java 17 or higher
- Maven
- Google Authenticator mobile app (for scanning QR codes)

## Setup and Installation
1. **Clone the repository**
   ```sh
   git clone https://github.com/AmitSahoo665/Spring-Security-Google-Authenticator.git
   cd Spring-Security-Google-Authenticator
   ```

2. **Build the project**
   ```sh
   mvn clean install
   ```

3. **Run the application**
   ```sh
   mvn spring-boot:run
   ```

4. **Access the application**
   Open a web browser and navigate to:
   ```
   http://localhost:8080
   ```

## How It Works
1. A user registers and receives a QR code.
2. The user scans the QR code using Google Authenticator.
3. During login, the user provides their credentials and a six-digit code from Google Authenticator.
4. If authentication is successful, access is granted.

## Dependencies
This project uses the following dependencies:
- Spring Boot Security
- Google Authenticator library
- Lombok
- Thymeleaf (for views)

## Contributing
If you would like to contribute, feel free to fork the repository and submit a pull request.

## License

## Contact
For any queries, reach out to [https://github.com/AmitSahoo665].
