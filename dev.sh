alias start='docker compose -f docker-compose.yml up -d'
alias stop='docker compose -f docker-compose.yml down'
alias restart='stop && start'
alias rebuild='docker compose -f docker-compose.yml up -d --build'