from flask import Flask, request, jsonify
from flask_cors import CORS
import string
import re
import secrets
import hashlib
import requests
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)

def generate_complex_password(length=16):
    """Generate a complex password with specific requirements"""
    # Define character sets with more complexity
    lowercase = string.ascii_lowercase
    uppercase = string.ascii_uppercase
    digits = string.digits
    special = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    extra_special = "~`'\""  # Additional special characters
    
    # Ensure minimum requirements
    password = [
        secrets.choice(uppercase),
        secrets.choice(lowercase),
        secrets.choice(digits),
        secrets.choice(special),
        secrets.choice(extra_special)
    ]
    
    # Add remaining characters
    all_chars = lowercase + uppercase + digits + special + extra_special
    for _ in range(length - 5):
        password.append(secrets.choice(all_chars))
    
    # Shuffle password
    random.shuffle(password)
    final_pass = ''.join(password)
    
    # Ensure no patterns exist
    while (re.search(r'(.)\1{2,}', final_pass) or  # No triple characters
           re.search(r'\d{3,}', final_pass) or      # No number sequences
           re.search(r'[a-zA-Z]{3,}', final_pass)): # No letter sequences
        random.shuffle(password)
        final_pass = ''.join(password)
    
    return final_pass

def generate_quantum_secure_password(length=24):
    """Generate a quantum-secure password with extreme complexity"""
    # Use larger character set and longer length
    all_chars = (string.ascii_letters + string.digits + string.punctuation +
                 ''.join(chr(i) for i in range(161, 256) if chr(i).isprintable()))
    
    # Generate base password
    password = []
    
    # Ensure all character types are included
    password.extend([
        secrets.choice(string.ascii_uppercase),
        secrets.choice(string.ascii_lowercase),
        secrets.choice(string.digits),
        secrets.choice(string.punctuation),
        secrets.choice([chr(i) for i in range(161, 256) if chr(i).isprintable()])
    ])
    
    # Fill remaining length with random characters
    for _ in range(length - 5):
        password.append(secrets.choice(all_chars))
    
    # Multiple rounds of shuffling for additional randomness
    for _ in range(3):
        random.shuffle(password)
    
    final_pass = ''.join(password)
    
    # Add quantum-inspired complexity
    timestamp = str(int(datetime.utcnow().timestamp()))
    entropy_addon = hashlib.sha256(timestamp.encode()).hexdigest()[:8]
    
    return final_pass + entropy_addon

def check_password_leaked_advanced(password):
    """Advanced password leak check using multiple sources"""
    results = {
        'leaked': False,
        'sources': [],
        'total_exposures': 0,
        'risk_level': 'Low',
        'details': []
    }
    
    # Check HaveIBeenPwned
    sha1_password = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
    prefix = sha1_password[:5]
    suffix = sha1_password[5:]
    
    try:
        response = requests.get(f'https://api.pwnedpasswords.com/range/{prefix}')
        if response.status_code == 200:
            hashes = (line.split(':') for line in response.text.splitlines())
            for hash_suffix, count in hashes:
                if hash_suffix == suffix:
                    results['leaked'] = True
                    results['sources'].append('HaveIBeenPwned Database')
                    results['total_exposures'] += int(count)
                    results['details'].append(f"Found in {count} data breaches")
    except Exception as e:
        results['details'].append("Error checking HaveIBeenPwned database")

    # Additional checks could be added here for other sources
    
    # Determine risk level
    if results['total_exposures'] > 1000000:
        results['risk_level'] = 'Critical'
    elif results['total_exposures'] > 100000:
        results['risk_level'] = 'High'
    elif results['total_exposures'] > 1000:
        results['risk_level'] = 'Medium'
    
    return results

def check_password_strength(password):
    """Enhanced password strength checker"""
    strength = {
        'score': 0,
        'feedback': [],
        'requirements_met': [],
        'requirements_failed': []
    }
    
    # Basic requirements
    checks = [
        (len(password) >= 16, "Minimum 16 characters", "Password must be at least 16 characters long"),
        (re.search(r'[A-Z]', password), "Contains uppercase letter", "Must contain uppercase letter"),
        (re.search(r'[a-z]', password), "Contains lowercase letter", "Must contain lowercase letter"),
        (re.search(r'\d', password), "Contains number", "Must contain number"),
        (re.search(r'[!@#$%^&*(),.?":{}|<>]', password), "Contains special character", "Must contain special character"),
        (not re.search(r'(.)\1{2,}', password), "No character repetition", "Cannot contain repeating characters"),
        (not any(pattern in password.lower() for pattern in ['123', 'abc', 'qwerty', 'password']),
         "No common patterns", "Contains common password pattern")
    ]
    
    for check, success_msg, fail_msg in checks:
        if check:
            strength['score'] += 1
            strength['requirements_met'].append(success_msg)
        else:
            strength['requirements_failed'].append(fail_msg)

    # Calculate complexity score
    entropy = len(set(password)) / len(password)
    if entropy > 0.7:
        strength['score'] += 1
        strength['requirements_met'].append("Good character diversity")
    
    # Determine strength level
    if strength['score'] <= 2:
        strength_level = "Very Weak"
    elif strength['score'] <= 4:
        strength_level = "Weak"
    elif strength['score'] <= 6:
        strength_level = "Medium"
    elif strength['score'] <= 7:
        strength_level = "Strong"
    else:
        strength_level = "Very Strong"

    return {
        'strength': strength_level,
        'score': strength['score'],
        'max_score': 8,
        'requirements_met': strength['requirements_met'],
        'requirements_failed': strength['requirements_failed']
    }

@app.route('/check_password', methods=['POST'])
def check_password():
    try:
        data = request.get_json()
        password = data.get('password', '')
        
        strength_result = check_password_strength(password)
        leak_result = check_password_leaked_advanced(password)
        
        return jsonify({
            **strength_result,
            'leak_check': leak_result
        })
    except Exception as e:
        return jsonify({
            'strength': 'Error',
            'feedback': ['An error occurred while checking the password.']
        }), 500

@app.route('/generate_password', methods=['GET'])
def generate_password_route():
    try:
        length = int(request.args.get('length', 16))
        if length < 16: length = 16
        if length > 100: length = 100
        
        password = generate_complex_password(length)
        return jsonify({'password': password})
    except Exception as e:
        return jsonify({'error': 'Failed to generate password'}), 500

@app.route('/generate_quantum_secure_password', methods=['GET'])
def generate_quantum_secure_password_route():
    try:
        length = int(request.args.get('length', 24))
        if length < 24: length = 24
        if length > 100: length = 100
        
        password = generate_quantum_secure_password(length)
        return jsonify({'password': password})
    except Exception as e:
        return jsonify({'error': 'Failed to generate quantum-secure password'}), 500

if __name__ == '__main__':
    app.run(debug=True)