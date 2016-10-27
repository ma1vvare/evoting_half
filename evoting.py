import subprocess

# Generate public key & Certificate
subprocess.call(" node server1.js", shell=True)
subprocess.call(" node server2.js", shell=True)
subprocess.call(" node server3.js", shell=True)
subprocess.call(" node staff.js", shell=True)
# User votes to their candidate.
subprocess.call(" node evoting.js 10", shell=True)
# Servers use their secret key to decrypt personal data.
subprocess.call(" python decrypt1.py", shell=True)
subprocess.call(" python decrypt2.py", shell=True)
subprocess.call(" python decrypt3.py", shell=True)
# After decryption, servers execute paillier encryption with staff's
# public key. Server3 will send latest cipher text to Server1 and 2.
subprocess.call(" node server1.js read", shell=True)
subprocess.call(" node server2.js read", shell=True)
subprocess.call(" node server3.js read", shell=True)
# Staff use his secret key to decrypt, amd get final answer.
subprocess.call(" python staff_decrypt.py ", shell=True)
