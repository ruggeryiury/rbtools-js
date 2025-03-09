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

print("All required packages are installed!")
