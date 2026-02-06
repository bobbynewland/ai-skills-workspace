#!/bin/bash
# Gemini CLI Coding Assistant
# Uses Gemini CLI for free coding tasks

# Set API key
export GEMINI_API_KEY="AIzaSyCDHTGxm3wFtoNHCkl__k1YNvi_n9KxycA"

# Function to generate code
generate_code() {
    local prompt="$1"
    local output="$2"
    
    echo "🤖 Generating code with Gemini CLI..."
    
    if [ -n "$output" ]; then
        gemini generate "$prompt" --output "$output"
        echo "✅ Code saved to: $output"
    else
        gemini generate "$prompt"
    fi
}

# Function to review code
review_code() {
    local file="$1"
    echo "🔍 Reviewing $file with Gemini CLI..."
    gemini review "$file"
}

# Function to explain code
explain_code() {
    local file="$1"
    echo "📖 Explaining $file..."
    gemini explain "$file"
}

# Function to edit code
edit_code() {
    local file="$1"
    local instruction="$2"
    echo "✏️ Editing $file..."
    gemini edit "$file" "$instruction"
}

# Main menu
case "$1" in
    generate|gen|g)
        generate_code "$2" "$3"
        ;;
    review|r)
        review_code "$2"
        ;;
    explain|e)
        explain_code "$2"
        ;;
    edit)
        edit_code "$2" "$3"
        ;;
    chat|c)
        echo "💬 Starting Gemini chat..."
        gemini chat
        ;;
    ask|a)
        echo "❓ Asking Gemini..."
        gemini ask "$2"
        ;;
    *)
        echo "Gemini CLI Coding Assistant"
        echo "============================"
        echo ""
        echo "Usage:"
        echo "  ./gemini_coder.sh generate 'prompt' [output_file]"
        echo "  ./gemini_coder.sh review file.js"
        echo "  ./gemini_coder.sh explain file.py"
        echo "  ./gemini_coder.sh edit file.js 'add error handling'"
        echo "  ./gemini_coder.sh chat"
        echo "  ./gemini_coder.sh ask 'how to optimize SQL'"
        echo ""
        echo "Examples:"
        echo "  ./gemini_coder.sh generate 'Create React login form' Login.jsx"
        echo "  ./gemini_coder.sh review app.js"
        echo "  ./gemini_coder.sh ask 'best practices for async/await'"
        ;;
esac
