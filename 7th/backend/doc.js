import swaggerJsDocs from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  swaggerDefinition: {
    info: {
      title: "Blogsite api docs",
      description: "Blogsite api doc details here",
      version: "1.0.0",
      contact: {
        name: "Kamal Shahi",
        email: "kamal@gmail.com",
        url: "https://kamal.org",
      },
    },
    servers: [
      {
        url: "http://localhost:8000", // url
        description: "Local server", // name
      },
    ],
  },
  //['.routes/*.js']
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDocs(options);

export default function apiDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}
