FROM node:16-alpine


Copy package.json yarn.lock ./

RUN yarn install

Copy next.config.js ./next.config.js
Copy tsconfig.json ./tsconfig.json
Copy public ./public
Copy styles ./styles
Copy src ./src

Copy .editorconfig ./.editorconfig
Copy .eslintrc.json ./.eslintrc.json
Copy next-env.d.ts ./next-env.d.ts
Copy next.d.ts ./next.d.ts
Copy next.d.ts ./next.d.ts
Copy postcss.config.js ./postcss.config.js
Copy tailwind.config.js ./tailwind.config.js

CMD ["yarn", "dev"]