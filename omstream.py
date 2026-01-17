import subprocess
import time
import webbrowser
import os
import sys

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")

def install_backend_dependencies():
    print("Installing backend dependencies...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], cwd=BACKEND_DIR, check=True)

def install_frontend_dependencies():
    print("Installing frontend dependencies...")
    subprocess.run(["npm", "install"], cwd=FRONTEND_DIR, shell=True, check=True)

def start_backend():
    print("Starting backend...")

    return subprocess.Popen(
        [
            sys.executable,
            "-m",
            "uvicorn",
            "app.main:app",
            "--host", "127.0.0.1",
            "--port", "8000",
            "--reload"
        ],
        cwd=BACKEND_DIR
    )

def start_frontend():
    print("Starting frontend...")
    return subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=FRONTEND_DIR,
        shell=True
    )

def main():
    print("=== OmStream Launcher ===")

    # Clear authentication state on fresh start
    print("Clearing authentication state...")
    try:
        import tempfile
        import json
        # Create a simple HTML file to clear localStorage
        clear_script = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Clearing Session</title>
        </head>
        <body>
            <script>
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = 'http://localhost:5173/login';
            </script>
            <p>Clearing session and redirecting...</p>
        </body>
        </html>
        """
        # temp_file = os.path.join(tempfile.gettempdir(), "clear_session.html")
        # with open(temp_file, 'w') as f:
        #     f.write(clear_script)
        
        # Open the clear script first
        # webbrowser.open(f"file://{temp_file}")
        time.sleep(2)  # Give time for localStorage to clear
    except Exception as e:
        print(f"Could not clear session: {e}")

    install_backend_dependencies()
    install_frontend_dependencies()

    backend = start_backend()
    time.sleep(5)

    frontend = start_frontend()
    time.sleep(6)

    print("Opening browser...")
    webbrowser.open("http://localhost:5173/login")

    print("\nOmStream is live!")
    print("Backend -> http://localhost:8000")
    print("Frontend -> http://localhost:5173")
    print("\nPress Ctrl+C to stop everything")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down...")
        backend.terminate()
        frontend.terminate()

if __name__ == "__main__":
    main()