# ==== Builder ====

FROM node:18-alpine as builder
ARG BACKEND_URL

WORKDIR /build

COPY package*.json ./
RUN npm install

COPY . . 

RUN echo "export const API_URL ='""$BACKEND_URL""';" > src/api/server.ts
RUN npx expo export --platform web 

# ==== Server ====

FROM node:18-alpine
WORKDIR /usr/src/app
ARG FRONTEND_URL

# Install serve globally
RUN npm install -g serve

# Copy the built app files from the builder stage
COPY --from=builder /build/dist/_expo/static/js/web/AppEntry-*.js app.js
COPY --from=builder /build/dist/assets assets
COPY --from=builder /build/dist/index.html index.html
COPY --from=builder /build/dist/metadata.json metadata.json
COPY --from=builder /build/website-assets/* ./

# Modify index.html if needed
RUN sed -i 's|/_expo/static/js/web/AppEntry-.*\.js|app.js|' index.html
RUN sed -i '/<link rel="shortcut icon" href="\/favicon\.ico" \/>/i <link rel="manifest" href="\/manifest.json">' index.html
RUN sed -i '/"scope": "\/"/a \  "start_url": "'$FRONTEND_URL'",' manifest.json

# Expose the default HTTP port
EXPOSE 8080

# Start
CMD ["serve", "/usr/src/app/", "-l", "8080"]

