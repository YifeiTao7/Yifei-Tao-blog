# 使用Node官方镜像
FROM node:14

# 设置工作目录
WORKDIR /app/server

# 复制package.json文件和package-lock.json文件
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制所有后端文件到工作目录
COPY . .

# 环境变量
# 注意，真实部署时应该通过环境配置的方式传入敏感信息，如数据库密码等
ENV PORT=3001

# 暴露端口3001
EXPOSE 3001

# 运行Node.js服务器
CMD ["node", "index.js"]
