# Password Security Suite

A comprehensive password security application that provides password strength analysis, breach checking, and secure password generation including quantum-resistant options.

![Password Security Suite](screenshot.png)

## Features

- **Password Strength Analyzer**
  - Multi-factor strength assessment
  - Data breach verification
  - Detailed security feedback
  - Real-time strength indicators

- **Complex Password Generator**
  - Customizable length (16-100 characters)
  - Mixed character sets
  - Special characters
  - Anti-pattern protection

- **Quantum-Secure Password Generator**
  - Enhanced entropy
  - Extended character sets
  - Future-proof security
  - Minimum 24-character length

## Technology Stack

- **Frontend**
  - React
  - Material-UI
  - Axios
  - Custom CSS animations

- **Backend**
  - Python
  - Flask
  - Flask-CORS
  - Cryptography libraries

## Installation

1. Clone the repository:

git clone https://github.com/your-username/password-security-suite.git


cd password-security-suite

2.Install backend dependencies:

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt


3.Install frontend dependencies:

cd frontend
npm install

4.Create a .env file in the root directory:

FLASK_APP=app.py
FLASK_ENV=development

5.Start the backend server:

flask run


6.Start the frontend development server:

npm start


Usage

    Password Strength Checker
        Enter your password in the strength checker
        View detailed analysis of password strength
        Check if password has been exposed in data breaches
        Get recommendations for improvements

    Password Generator
        Select desired password length
        Generate secure random passwords
        Copy generated passwords to clipboard
        Regenerate new passwords as needed

    Quantum-Secure Generator
        Choose length (minimum 24 characters)
        Generate quantum-resistant passwords
        Copy and regenerate as needed

Security Considerations

    All password checking is done client-side
    No passwords are stored or transmitted
    Uses k-anonymity for breach checking
    Implements secure random generation
    No logging of generated passwords

Contributing

    Fork the repository
    Create your feature branch (git checkout -b feature/AmazingFeature)
    Commit your changes (git commit -m 'Add some AmazingFeature')
    Push to the branch (git push origin feature/AmazingFeature)
    Open a Pull Request

License

This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments

    HaveIBeenPwned API for breach checking
    Material-UI for components
    React community for tools and support

Contact

Your Name - @Manpreet61156873

Project Link: https://github.com/your-username/password-security-suite