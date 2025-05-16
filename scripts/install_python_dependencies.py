import subprocess
import sys

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

try:
    import PIL
except ImportError:
    print("Pillow is not installed. Installing...")
    install("Pillow")

try:
    import mido
except ImportError:
    print("Mido is not installed. Installing...")
    install("mido")
    
try:
    import aenum
except ImportError:
    print("aenum is not installed. Installing...")
    install("aenum")
    
    
try:
    import fastxor
except ImportError:
    print("fastxor is not installed. Installing...")
    install("fastxor")
    
try:
    import Cryptodome
except ImportError:
    print("Cryptodome is not installed. Installing...")
    install("pycryptodomex")
        
try:
    import ecdsa
except ImportError:
    print("ecdsa is not installed. Installing...")
    install("ecdsa")
        
try:
    import cryptography
except ImportError:
    print("cryptography is not installed. Installing...")
    install("cryptography")

print("All required packages are installed!")
