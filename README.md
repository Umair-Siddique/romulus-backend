## API Documentation

```
http://localhost:5000/api-docs
```

## Project Structure

```
🗂️ romulus-backend
├── 🗂️ src
│   ├── 🗂️ config
│   │   ├── 📄 cloudinary.config.js
│   │   ├── 📄 database.config.js
│   │   ├── 📄 env.config.js
│   │   ├── 📄 index.js
│   │   ├── 📄 logger.config.js
│   │   ├── 📄 mail.config.js
│   │   ├── 📄 swagger.config.js
│   │   └── 📄 twilio.config.js
│   ├── 🗂️ constants
│   │   └── 📄 index.js
│   ├── 🗂️ data-access
│   │   ├── 📄 blacklisted-token.data-access.js
│   │   ├── 📄 educator.data-access.js
│   │   ├── 📄 index.js
│   │   ├── 📄 mission.data-access.js
│   │   ├── 📄 notification.data-access.js
│   │   ├── 📄 organization.data-access.js
│   │   ├── 📄 report.data-access.js
│   │   └── 📄 user.data-access.js
│   ├── 🗂️ docs
│   │   └── 🗂️ swagger
│   │       ├── 📄 auth.yaml
│   │       ├── 📄 common.yaml
│   │       ├── 📄 educators.yaml
│   │       ├── 📄 email.yaml
│   │       ├── 📄 health.yaml
│   │       ├── 📄 missions.yaml
│   │       ├── 📄 notifications.yaml
│   │       ├── 📄 organizations.yaml
│   │       └── 📄 twilio.yaml
│   ├── 🗂️ dtos
│   │   ├── 🗂️ schemas
│   │   │   ├── 📄 auth-schema.js
│   │   │   ├── 📄 educator-schema.js
│   │   │   ├── 📄 index.js
│   │   │   ├── 📄 mission-schema.js
│   │   │   ├── 📄 organization-schema.js
│   │   │   └── 📄 utils.js
│   │   ├── 📄 index.js
│   │   └── 📄 validations.js
│   ├── 🗂️ middleware
│   │   ├── 🗂️ global-middleware
│   │   │   ├── 📄 error-handler.js
│   │   │   ├── 📄 index.js
│   │   │   └── 📄 invalid-route-handler.js
│   │   ├── 📄 index.js
│   │   ├── 📄 upload.middleware.js
│   │   └── 📄 validate.middleware.js
│   ├── 🗂️ models
│   │   ├── 📄 blacklisted-token.model.js
│   │   ├── 📄 educator.model.js
│   │   ├── 📄 index.js
│   │   ├── 📄 mission.model.js
│   │   ├── 📄 notification.model.js
│   │   ├── 📄 organization.model.js
│   │   ├── 📄 report.model.js
│   │   └── 📄 user.model.js
│   ├── 🗂️ modules
│   │   ├── 🗂️ auth
│   │   │   ├── 📄 auth.controllers.js
│   │   │   ├── 📄 auth.routes.js
│   │   │   └── 📄 auth.services.js
│   │   ├── 🗂️ educator
│   │   │   ├── 📄 educator.controllers.js
│   │   │   ├── 📄 educator.routes.js
│   │   │   └── 📄 educator.services.js
│   │   ├── 🗂️ email
│   │   │   ├── 📄 email.controllers.js
│   │   │   ├── 📄 email.routes.js
│   │   │   └── 📄 email.services.js
│   │   ├── 🗂️ health
│   │   │   ├── 📄 health.controllers.js
│   │   │   ├── 📄 health.routes.js
│   │   │   └── 📄 health.services.js
│   │   ├── 🗂️ mission
│   │   │   ├── 📄 mission.controllers.js
│   │   │   ├── 📄 mission.routes.js
│   │   │   └── 📄 mission.services.js
│   │   ├── 🗂️ notification
│   │   │   ├── 📄 notification.controllers.js
│   │   │   ├── 📄 notification.routes.js
│   │   │   └── 📄 notification.services.js
│   │   ├── 🗂️ organization
│   │   │   ├── 📄 organization.controllers.js
│   │   │   ├── 📄 organization.routes.js
│   │   │   └── 📄 organization.services.js
│   │   ├── 🗂️ reports
│   │   │   ├── 📄 reports.controllers.js
│   │   │   ├── 📄 reports.routes.js
│   │   │   └── 📄 reports.services.js
│   │   ├── 🗂️ twilio
│   │   │   ├── 📄 twilio.controllers.js
│   │   │   ├── 📄 twilio.routes.js
│   │   │   └── 📄 twilio.services.js
│   │   └── 📄 index.js
│   ├── 🗂️ routes
│   │   └── 📄 index.js
│   ├── 🗂️ server
│   │   └── 📄 index.js
│   ├── 🗂️ utils
│   │   ├── 📄 geo-coding.utils.js
│   │   ├── 📄 global.utils.js
│   │   ├── 📄 index.js
│   │   ├── 📄 mail.utils.js
│   │   ├── 📄 password.utils.js
│   │   ├── 📄 token.utils.js
│   │   └── 📄 twilio.utils.js
│   ├── 🗂️ views
│   │   ├── 🗂️ reset-password
│   │   │   └── 📄 index.html
│   │   ├── 🗂️ verification-email
│   │   │   └── 📄 index.html
│   │   └── 🗂️ verification-notification
│   │       └── 📄 index.html
│   └── 📄 index.js
├── 📄 eslint.config.js
├── 📄 nodemon.json
├── 📄 package-lock.json
├── 📄 package.json
└── 📄 README.md
```
