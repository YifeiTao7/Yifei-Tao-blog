# 使用Node官方镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app/client

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制所有文件到工作目录
COPY . .

# 构建用于生产的app
RUN npm run build

# 安装serve作为依赖而非全局安装
RUN npm install serve

# 暴露端口80
EXPOSE 80

# 用户设置回到默认的root，以允许绑定到特权端口
USER root

# 运行serve来托管React的构建文件，在80端口上监听
CMD ["npx", "serve", "-s", "build", "-l", "tcp://0.0.0.0:80"]
