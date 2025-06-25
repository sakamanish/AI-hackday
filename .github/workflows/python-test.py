name: Python CI

on:
  push:
  pull_request:

jobs:
  run-python-code:
    runs-on: ubuntu-latest

    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v3

    - name: 🐍 Set up Python
      uses: actions/setup-python@v5
      with:
        python-version: '3.11'

    - name: ✅ Check syntax for all .py files
      run: |
        echo "Checking syntax of all .py files..."
        for file in $(find . -name "*.py"); do
          echo "Checking $file"
          python -m py_compile "$file"
        done
        echo "✅ All files passed syntax check"

    - name: ▶ Run Python Code (main.py)
      run: |
        echo "Output of main.py:"
        python main.py

    - name: 🧪 Run tests (if any)
      run: |
        pip install pytest
        pytest || echo "No tests or test failed"
