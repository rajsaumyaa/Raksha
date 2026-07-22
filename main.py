import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

import main as backend_main

app = backend_main.app
