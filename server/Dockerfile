# 使用Node.js的Alpine版本作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app/server

# 复制package.json文件和package-lock.json文件
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制所有后端文件到工作目录
COPY . .

# 使用非root用户运行应用
USER node

# 环境变量
ENV PORT=3001

# 暴露端口3001
EXPOSE 3001

# 运行Node.js服务器
CMD ["node", "server.js"]
