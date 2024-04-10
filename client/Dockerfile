# 使用Node官方镜像
FROM node:14

# 设置工作目录
WORKDIR /app/client

# 复制package.json文件和package-lock.json文件
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制所有文件到工作目录
COPY . .

# 构建用于生产的app
RUN npm run build

# 安装serve
RUN npm install -g serve

# 暴露端口3000
EXPOSE 3000

# 运行serve来托管React的构建文件
CMD ["serve", "-s", "build", "-l", "3000"]
