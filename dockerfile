# Sử dụng một image base đã có Node.js cài đặt
FROM node:14-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json (nếu có) vào container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Biên dịch TypeScript sang JavaScript
RUN npm run build

# Expose cổng mà ứng dụng của bạn chạy trên
EXPOSE 8000

# Khởi chạy ứng dụng
CMD ["npm", "start"]
