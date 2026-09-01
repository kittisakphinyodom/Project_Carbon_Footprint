-Clone จาก Github
    เปิด command

        git clone https://github.com/USERNAME/Carbon-Footprint.git

-เข้าโปรเจกที่เรา clone ไว้
    cd Carbon-Footprint

ขั้นที่ 1 — เปิด Docker Desktop
    เปิด Docker Desktop ให้ทำงานก่อน

ขั้นที่ 2 — สร้าง Database
    docker compose up -d

ขั้นที่ 3 — ติดตั้ง Backend
    cd backend
    npm install
    npm run dev

ขั้นที่ 4 — ติดตั้ง Frontend
    cd frontend
    npm install
    npm run dev

ขั้นที่ 5 — เปิดเว็บ ในส่วนของ frontend
http://localhost:5173

ขั้นที่ 6 — ถ้าต้องการดู Database
http://localhost:8080

Login:
Server: mysql
Username: root
Password: 66160114